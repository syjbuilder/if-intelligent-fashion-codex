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
| `RATE_LIMITED` | 429 | 호출 빈도 제한 초과 (유저/IP/가입 rate limit — §rate limit 참조) |
| `INSUFFICIENT_TOKENS` | 402 | 토큰 부족 (잔액 < 10) |
| `INTERPRETATION_FAILED` | 422 | 프롬프트 의도 파싱 실패 |
| `GENERATION_FAILED` | 502 | AI 이미지 생성 실패 (외부 API) — 부분실패 시 자동 환불 (§3 참조) |
| `VALIDATION_ERROR` | 400 | 입력값 검증 실패 (§입력 validation 참조) |
| `CAPACITY_LIMITED` | 503 | 전역 일일 cap 초과 또는 kill switch ON — 생성 일시 차단 (ADR-015) |
| `INTERNAL` | 500 | 알 수 없음 |

> 비고: `RATE_LIMITED`(429)는 "잠시 후 재시도하면 풀리는" 빈도 제한이고, `INSUFFICIENT_TOKENS`(402)는
> "토큰을 충전/업그레이드해야 풀리는" 잔액 부족이다. ADR-012 이전 표현("토큰 소진 또는 호출 제한"을 429에 묶음)을
> 분리 — 토큰 소진은 402, 호출 빈도 제한은 429로 명확히 구분한다.

### Idempotency (ADR-014)
- **모든 generation 요청에 `X-Idempotency-Key` 헤더 필수** — `POST /api/looks/generate`, `POST /api/looks/:id/more-like-this`. 헤더 누락 시 `VALIDATION_ERROR`(400, `missing_idempotency_key`).
- 키 형식: 클라이언트 생성 UUID v4 권장. 한 번의 사용자 액션(검색 1회·MLT 1회) = 키 1개.
- 서버는 키를 `token_transactions.idempotency_key` 컬럼에 저장하고 `unique(user_id, idempotency_key)`로 강제한다. **같은 (user_id, key) 재요청은 토큰을 재차감하지 않고 최초 성공 응답을 그대로 반환**(캐시 응답) — 더블클릭·네트워크 재시도·동기 함수 타임아웃 후 재시도(ADR-013) 시 이중 차감 차단.
- 차감 정합성(행 잠금·트랜잭션·환불)의 구현 근거는 ADR-014 / `docs/DATA_MODEL.md`(007_token_rpc.sql)에 있다. 본 문서는 호출 측 계약만 정의한다.

### Rate limit (ADR-016)
- 라우트 레벨에서 빈도 제한을 적용한다. 초과 시 `RATE_LIMITED`(429) + `Retry-After` 헤더(초).
- **초기 기본값** (운영 데이터로 조정):

| 범위 | 한도 | 적용 대상 |
|---|---|---|
| 유저당 | 10회 / 분 | 인증된 generation 요청(`/generate`, `/more-like-this`) |
| IP당 | 30회 / 분 | 모든 요청(비로그인 `/explore` 포함) |
| 가입 IP당 | 5개 / 일 | 신규 가입(무료 토큰 grant 파밍 방지) |

- 가입 abuse 차단: 가입 IP 한도 초과 시에도 `RATE_LIMITED`(429). 가입 시 10토큰 grant는 멱등(ADR-016, Auth trigger `ON CONFLICT DO NOTHING`)으로 1회만.
- 429는 잔액과 무관 — 토큰이 충분해도 빈도 초과면 429. 잔액 부족은 402(`INSUFFICIENT_TOKENS`).

### 입력 validation
- 모든 라우트는 서버에서 입력을 검증하고, 실패 시 `VALIDATION_ERROR`(400) + 필드별 사유를 반환한다. 클라이언트 검증은 UX 보조일 뿐, 신뢰 경계는 서버.
- 공통 제약:

| 필드 | 제약 | 비고 |
|---|---|---|
| `raw_prompt` | 1~300자, trim 후 비어있지 않음 | 초과 시 `prompt_too_long`. 한국어 taxonomy 파싱 부담·비용 상한 |
| `chip_refinements` | 최대 5개, 각 항목 사전 정의 칩 라벨 화이트리스트 | 임의 문자열 거부(`invalid_chip`) |
| `trigger_type` | enum 화이트리스트(`fresh`/`regenerate`/`chip_refine`) | 그 외 거부 |
| `variation_axis` | enum 화이트리스트(`auto`/`color`/`style`/`fit`) | 그 외 거부 |
| `visibility` | enum(`private`/`public`) | 그 외 거부 |
| `*_id` (uuid) | UUID 형식 | 형식 오류 시 400, 존재하지 않으면 404 |
| `X-Idempotency-Key` | 비어있지 않은 문자열(UUID 권장) | generation 요청 필수 |

- 프롬프트 파싱 결과(season·mood·items 등)는 한국어 패션 taxonomy enum 화이트리스트로 검증한다(`docs/AI_PIPELINE.md` 정합). 화이트리스트 밖 값은 드롭하거나 `INTERPRETATION_FAILED`(422).

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

의도(intent)로부터 룩 3개 생성. **B-path(curated 검색) 우선, A-path(AI 실시간 생성) fallback.**

**Auth:** 필수 (토큰 차감 발생)

**필수 헤더:** `X-Idempotency-Key`(UUID 권장) — 누락 시 `VALIDATION_ERROR`(400). 같은 (user_id, key) 재요청은 재차감 없이 최초 응답 반환(ADR-014, §Idempotency).

**실행 모델:** Node.js runtime + maxDuration 상향(60초 목표, Vercel 플랜 한도 내)으로 **동기 처리**. 룩 3장은 `Promise.all` 병렬 생성으로 지연 단축(ADR-013). OpenAI 생성은 10~30초 소요.

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
1. rate limit·validation·idempotency 키 확인 (기존 키면 캐시 응답 즉시 반환)
2. 전역 일일 cap·kill switch 확인 → 초과/ON이면 `CAPACITY_LIMITED`(503), 차감 전에 차단(ADR-015)
3. `consume_tokens()` RPC로 10토큰 선차감 — 행 잠금·잔액 확인·트랜잭션·멱등 기록(ADR-014). 잔액 < 10이면 `INSUFFICIENT_TOKENS`(402)
4. intent 조회 → curated DB 의미적 매칭(B-path) 시도, 매칭 점수 ≥ 임계값이면 curated 룩 + (필요 시) AI 변형
5. 매칭 부족 시 OpenAI GPT Image 2로 신규 생성(A-path), 룩 3장 `Promise.all` 병렬
6. **3장 all-or-nothing**: 3장 모두 성공해야 응답. 일부 실패(부분성공)는 실패로 처리 → `refund_tokens()` RPC로 10토큰 자동 환불 후 `GENERATION_FAILED`(502)
7. 성공 시 생성 이미지를 Supabase Storage에 영속화(OpenAI URL 24h 만료 대응 — `generated_image_url`은 Storage 경로/서명 URL), `looks` row 생성, `generation_history` 기록
8. 비용·전략 결정은 `docs/AI_PIPELINE.md` 참조

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
- `VALIDATION_ERROR`(400) — `X-Idempotency-Key` 누락, `intent_id` 형식 오류, `trigger_type` enum 위반 등
- `RATE_LIMITED`(429) — 유저 10회/분 또는 IP 30회/분 초과 (`Retry-After` 동반)
- `INSUFFICIENT_TOKENS`(402) — 잔액 < 10 (free 1회 소진 포함)
- `CAPACITY_LIMITED`(503) — 전역 일일 cap 초과 또는 kill switch ON (차감 전 차단, ADR-015)
- `GENERATION_FAILED`(502) — A-path 호출 실패 또는 3장 미달(부분성공). **이 경우 10토큰 자동 환불됨**

**부분실패·자동 환불 응답 예 (GENERATION_FAILED):**
```json
{
  "ok": false,
  "error": {
    "code": "GENERATION_FAILED",
    "message": "룩 생성에 실패했습니다. 토큰은 다시 충전되었어요. 잠시 후 다시 시도해 주세요."
  },
  "data": {
    "refunded": true,
    "tokens_refunded": 10,
    "tokens_balance_after": 100
  }
}
```
- `refunded`/`tokens_refunded`/`tokens_balance_after`는 자동 환불 시에만 동반(에러 응답이지만 잔액 복구를 클라이언트가 즉시 반영하도록 `data` 포함). 환불은 `refund_tokens()` RPC로 멱등 처리(ADR-014) — 같은 idempotency_key 재시도 시 이중 환불 없음.

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

**필수 헤더:** `X-Idempotency-Key`(UUID 권장) — generate와 동일 규칙(ADR-014, §Idempotency).

**실행 모델·정합성:** §3와 동일 — 동기 처리(ADR-013), 10토큰 선차감(`consume_tokens()`), 3장 all-or-nothing, 부분실패 시 10토큰 자동 환불(`refund_tokens()`), 일일 cap·kill switch 차단(ADR-015).

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

**에러:** §3와 동일 코드 적용 — `VALIDATION_ERROR`(400, `X-Idempotency-Key` 누락 포함), `RATE_LIMITED`(429), `INSUFFICIENT_TOKENS`(402), `CAPACITY_LIMITED`(503), `GENERATION_FAILED`(502, 부분실패 시 10토큰 자동 환불 — 응답 형식 §3 동일).

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
- 2026-06-01: 백엔드 안전 보강 반영 (ADR-013~016) — `X-Idempotency-Key` 모든 generation 요청 필수화, §3·§7 부분실패 시 3장 all-or-nothing·10토큰 자동 환불 응답 스펙, rate limit 수치(유저 10/분·IP 30/분·가입 IP 5/일), 입력 validation 제약표(프롬프트 1~300자·enum 화이트리스트), 에러코드 보강(429 분리·503 `CAPACITY_LIMITED` 추가·402 잔액부족 의미 명확화). ADR-012 차감 양/개수(10토큰·항상 3개)는 불변 — 차감 "방식"만 안전화.
