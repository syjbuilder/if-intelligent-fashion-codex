# API Contracts

> V0 핵심 엔드포인트의 request/response 스키마. 모든 외부 API 호출(OpenAI, Supabase)은
> `src/app/api/` 라우트 핸들러에서만 이루어진다 — 클라이언트 컴포넌트에서 직접 호출 금지.
>
> 본 문서는 docs/PRD.md V0 Core + docs/ADR.md ADR-009 + docs/AI_PIPELINE.md와 정합.
> TRD 16장과 동시 sync 대상.

## 공통 규칙

### 인증
- 모든 `/api/looks/generate`, `/api/looks/:id/save`, `/api/looks/:id/more-like-this`는 **로그인 필수**.
- `/api/explore`, `/api/looks/:id`, `/api/looks/:id/products`는 **비로그인도 허용** (단, curated/public 룩만 노출).
- Supabase Auth JWT를 쿠키로 전달. 서버에서 `auth.uid()` 추출 후 RLS 적용.

### 응답 포맷
모든 응답은 JSON. 성공:
```json
{ "ok": true, "data": { ... } }
```
에러:
```json
{ "ok": false, "error": { "code": "STRING_CODE", "message": "사용자 표시용 한국어 메시지" } }
```

### 표준 에러 코드
| 코드 | HTTP | 의미 |
|---|---|---|
| `UNAUTHENTICATED` | 401 | 로그인 필요 |
| `FORBIDDEN` | 403 | 본인 데이터 아님 |
| `NOT_FOUND` | 404 | 리소스 없음 |
| `RATE_LIMITED` | 429 | 토큰 소진 또는 호출 제한 |
| `INSUFFICIENT_TOKENS` | 402 | 토큰 부족 (free 한도 초과) |
| `INTERPRETATION_FAILED` | 422 | 프롬프트 의도 파싱 실패 |
| `GENERATION_FAILED` | 502 | AI 이미지 생성 실패 (외부 API) |
| `VALIDATION_ERROR` | 400 | 입력값 검증 실패 |
| `INTERNAL` | 500 | 알 수 없음 |

### Idempotency
- `POST /api/looks/generate`, `/more-like-this` 호출 시 `X-Idempotency-Key` 헤더 권장 (중복 토큰 차감 방지).

### 토큰 차감 정책 (ADR-012)
- **1회 검색 = 10토큰 = 룩 3개** (OpenAI image generation 3회 호출). 검색 단위 일률 차감.
- 모든 generation 액션(fresh / regenerate / chip_refine / MLT / demo) **동일 10토큰** 차감. B-path 적중 여부 무관.
- `save` / `view explore·look·products` / `share`는 **0토큰**.
- `max_looks` 사용자 노출 파라미터 없음 — 서버는 항상 3개 룩 반환.
- 응답 `pipeline_source` 필드는 telemetry 용도(curated_only / mixed / generated_only). **사용자 노출 X**.
- 자세한 결제 모델·소진 UX는 ADR-012.

---

## 1. GET /api/explore

Explore 진입 피드 — 큐레이션 룩 + 시즌 데모 프롬프트.

**Auth:** 불필요 (비로그인 허용)

**Query:**
| 파라미터 | 타입 | 기본 | 설명 |
|---|---|---|---|
| `season` | string | 현재 시즌 자동 | 'spring' / 'summer' / 'fall' / 'winter' |
| `limit_looks` | int | 12 | 6~24 |
| `limit_prompts` | int | 5 | 3~8 |

**Response 200:**
```json
{
  "ok": true,
  "data": {
    "season": "summer",
    "curated_looks": [
      {
        "id": "uuid",
        "title": "한강 피크닉 꾸안꾸 룩",
        "base_prompt": "한강 피크닉에 어울리는 사진 잘 나오는 룩",
        "generated_image_url": "https://...",
        "mood_tags": ["casual", "lovely"]
      }
    ],
    "seasonal_prompts": [
      { "label": "여름 데이트룩", "prompt_seed": "여름 데이트에 입을 꾸안꾸 룩" }
    ]
  }
}
```

---

## 2. POST /api/prompts/interpret

프롬프트 자연어를 구조화 의도 JSON으로 분해.

**Auth:** 필수

**Request:**
```json
{
  "raw_prompt": "여름 데이트에 입을 꾸안꾸 룩",
  "parent_history_id": null,
  "chip_refinements": []
}
```

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `raw_prompt` | string | yes | 사용자 입력 또는 칩 합성 결과 |
| `parent_history_id` | uuid \| null | no | mini-action turn 추적 (chip refine·regenerate·more like this 시 부모 turn) |
| `chip_refinements` | string[] | no | 클릭한 칩 라벨 배열 (예: `["더 캐주얼하게", "가격대 ↓"]`) — 서버에서 raw_prompt에 결합 후 LLM 호출 |

**Response 200:**
```json
{
  "ok": true,
  "data": {
    "intent_id": "uuid",
    "parsed": {
      "season": "summer",
      "situation": ["date", "casual_outing"],
      "mood": ["clean", "lovely"],
      "items_hint": ["린넨셔츠", "세미와이드데님"],
      "colors": ["white", "sky_blue"],
      "fit_hints": ["slim_top", "wide_bottom"],
      "budget_max_krw": null,
      "user_size_hints": null
    },
    "normalized_prompt": "여름 데이트에 어울리는 캐주얼한 꾸안꾸 룩 (린넨 셔츠 + 세미와이드 데님)"
  }
}
```

**에러:** `INTERPRETATION_FAILED` (LLM 출력이 schema 검증 실패 — fallback으로 raw_prompt 그대로 generate 호출 가능).

---

## 3. POST /api/looks/generate

의도(intent)로부터 룩 1-3개 생성. **B-path(curated 검색) 우선, A-path(AI 실시간 생성) fallback.**

**Auth:** 필수 (토큰 차감 발생)

**Request:**
```json
{
  "intent_id": "uuid",
  "trigger_type": "fresh",
  "parent_history_id": null
}
```

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `intent_id` | uuid | yes | `/prompts/interpret` 응답의 `intent_id` |
| `trigger_type` | enum | yes | `'fresh'` / `'regenerate'` / `'chip_refine'` |
| `parent_history_id` | uuid \| null | no | regenerate·chip_refine 시 부모 turn |

(ADR-012: `max_looks` 파라미터 제거 — 서버는 항상 룩 3개 반환. 1회 검색 = 10토큰 일률 차감.)

**서버 동작:**
1. intent 조회 → curated DB에서 의미적 매칭(B-path) 시도
2. 매칭 점수 ≥ 임계값이면 curated 룩 반환 + (필요 시) AI로 변형
3. 매칭 부족 시 OpenAI GPT Image 2로 신규 생성(A-path)
4. `looks` row 생성, `generation_history` 기록, 토큰 차감
5. 비용·전략 결정은 `docs/AI_PIPELINE.md` 참조

**Response 200:**
```json
{
  "ok": true,
  "data": {
    "history_id": "uuid",
    "looks": [
      {
        "id": "uuid",
        "title": "여름 데이트 미니멀",
        "generated_image_url": "https://...",
        "source": "curated",
        "mood_tags": ["minimal", "clean"]
      },
      {
        "id": "uuid",
        "title": "여름 데이트 러블리",
        "generated_image_url": "https://...",
        "source": "generated",
        "mood_tags": ["lovely", "feminine"]
      },
      {
        "id": "uuid",
        "title": "여름 데이트 시크",
        "generated_image_url": "https://...",
        "source": "curated_remixed",
        "mood_tags": ["chic", "modern"]
      }
    ],
    "tokens_spent": 10,
    "tokens_balance_after": 90,
    "pipeline_source": "mixed"
  }
}
```

`source` (룩 단위): `'curated'` | `'curated_remixed'` | `'generated'`
`pipeline_source` (응답 단위, telemetry용 — UI 노출 X): `'curated_only'`(모두 curated) | `'mixed'`(curated + generated 혼재) | `'generated_only'`(모두 A-path 생성). ADR-012 기준 모든 케이스 동일 10토큰 차감.

**에러:**
- `INSUFFICIENT_TOKENS` — free 3회 소진
- `GENERATION_FAILED` — A-path 호출 실패 (B-path도 매칭 0이면)

---

## 4. GET /api/looks/:id

룩 상세.

**Auth:** 비로그인 허용 (단, 본인 private 룩이거나 public/curated 룩만)

**Response 200:**
```json
{
  "ok": true,
  "data": {
    "id": "uuid",
    "title": "여름 데이트 꾸안꾸 룩",
    "base_prompt": "...",
    "generated_image_url": "https://...",
    "season": "summer",
    "mood_tags": ["casual", "clean"],
    "is_curated": false,
    "visibility": "private",
    "created_at": "2026-05-17T12:00:00Z"
  }
}
```

---

## 5. GET /api/looks/:id/products

룩에 매칭된 상품 패널 데이터.

**Auth:** 비로그인 허용 (룩 read 권한 있는 경우만)

**Query:**
| 파라미터 | 타입 | 기본 | 설명 |
|---|---|---|---|
| `include_similar` | bool | true | 유사 상품 포함 |
| `include_related` | bool | true | 관련 상품 포함 |

**Response 200:**
```json
{
  "ok": true,
  "data": {
    "main_combo": [
      {
        "item_role": "main_top",
        "product": {
          "id": "uuid",
          "product_name": "코튼 린넨 셔츠",
          "brand_name": "MUSINSA STANDARD",
          "source_platform": "MUSINSA",
          "product_url": "https://...",
          "image_url": "https://...",
          "price": 49000,
          "color": "white",
          "fit": "regular"
        }
      }
    ],
    "similar": [ /* product list */ ],
    "related": [ /* product list */ ]
  }
}
```

---

## 6. POST /api/looks/:id/save

룩 저장 (saved_looks).

**Auth:** 필수. 비로그인 시 클라이언트가 사전 표기로 막아야 하지만, 서버도 401 응답.

**Request:**
```json
{ "visibility": "private" }
```

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `visibility` | enum | no | `'private'`(기본) / `'public'` |

**Response 200:**
```json
{
  "ok": true,
  "data": {
    "saved_look_id": "uuid",
    "look_id": "uuid",
    "visibility": "private",
    "created_at": "2026-05-17T12:00:00Z"
  }
}
```

**에러:**
- `UNAUTHENTICATED` (401) — 비로그인. 클라이언트는 이 응답 받기 전에 사전 표기로 처리해야 함 (Daydream 약점 회피)

---

## 7. POST /api/looks/:id/more-like-this

특정 룩 기준으로 변주 3개 생성.

**Auth:** 필수 (토큰 차감)

**Request:**
```json
{
  "variation_axis": "auto"
}
```

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `variation_axis` | enum | no | `'auto'`(기본) / `'color'` / `'style'` / `'fit'` |

**서버 동작:**
1. source 룩의 intent 조회
2. variation_axis에 따라 intent 일부 변형 (예: `color`면 mood/items 유지 + color만 다양화)
3. curated DB에서 변형 intent 매칭 → 부족 시 AI 생성
4. 3개 룩 반환, `generation_history` 기록 (`trigger_type='more_like_this'`, `parent_history_id`)

**Response 200:**
```json
{
  "ok": true,
  "data": {
    "source_look_id": "uuid",
    "history_id": "uuid",
    "variants": [
      { "id": "uuid", "title": "...", "generated_image_url": "https://...", "variation_summary": "원본 + 어두운 색조" },
      { "id": "uuid", "title": "...", "generated_image_url": "https://...", "variation_summary": "원본 + 오버핏" },
      { "id": "uuid", "title": "...", "generated_image_url": "https://...", "variation_summary": "원본 + 미니멀 무드" }
    ],
    "tokens_spent": 10,
    "tokens_balance_after": 80,
    "pipeline_source": "mixed"
  }
}
```

(ADR-012: MLT도 일반 generate와 동일 10토큰 차감.)

---

## 칩 정제 turn 처리 — 클라이언트 흐름

(별도 엔드포인트 X. `/interpret` + `/generate` 조합으로 처리.)

```
사용자가 결과 화면에서 "더 캐주얼하게" 칩 클릭
  ↓ 클라이언트:
POST /api/prompts/interpret
  body: { raw_prompt: 원래 prompt, chip_refinements: ["더 캐주얼하게"], parent_history_id: 원래 history_id }
  ↓ 응답: 새 intent_id
POST /api/looks/generate
  body: { intent_id: 새 intent, trigger_type: "chip_refine", parent_history_id: 원래 history_id }
  ↓ 응답: 새 룩 결과
```

→ 사용자 입장: "칩 클릭 = AI가 다시 답해줌" (대화 turn 느낌)
→ 서버 입장: 2-call sequence + history 부모 추적

---

## V0 Extended 엔드포인트 (V0 Core 후 추가)

- `GET /api/history` — 사용자 generation_history + saved_looks 통합 뷰
- `GET /api/tokens/balance` — 토큰 잔액
- `POST /api/tokens/use` — 명시적 토큰 차감 (admin/internal)
- `GET /api/admin/looks` / `POST /api/admin/looks` / `PATCH /api/admin/looks/:id` — 어드민 룩 관리
- `GET /api/admin/products` / `POST /api/admin/products` / `PATCH /api/admin/products/:id` — 어드민 상품 관리

## 변경 이력

- 2026-05-17: 초기 작성. PRD V0 Core + ADR-009 반영. 핵심 7개 엔드포인트 명세 (Explore·interpret·generate·look detail·products·save·more-like-this).
