# 데이터 모델

> 출처: `기술/I.F V0 TRD.md` 15장. 본 문서는 V0 Supabase Postgres 스키마의 정식 기록이다.
> TRD 원본과 충돌 시 본 문서가 우선한다. 새 테이블/컬럼 추가 시 TRD도 동시 sync.

## 원칙

- 모든 테이블은 Supabase RLS(Row Level Security)로 보호. 기본 정책: **본인 데이터만 read/write 가능**.
- 큐레이션 룩(`looks.is_curated=true`)과 운영자 등록 상품(`products`)은 anonymous read 허용 (Explore 피드 노출).
- 모든 테이블에 `created_at`, `updated_at` (mutable 테이블만) 포함.
- ID는 `uuid` 기본. 외부 노출이 필요한 경우만 short id 추가.
- 한국어 텍스트는 `text` 또는 `varchar(N)` (가변 길이가 일반적).
- 태그·배열은 Postgres `text[]` (Supabase 친화).

## 테이블 목록

| 테이블 | 용도 | RLS 기본 정책 |
|---|---|---|
| `users` | 계정·플랜·토큰 잔액 | 본인만 |
| `looks` | AI 룩(curated 500개 + 사용자 생성) | curated는 anonymous read, 사용자 생성은 본인만 |
| `products` | 상품 카탈로그 | anonymous read (운영자 어드민만 write) |
| `look_products` | 룩 ↔ 상품 매핑 | look 정책 상속 |
| `saved_looks` | 사용자 저장 룩 (히스토리) | 본인만 |
| `generation_history` | 프롬프트·룩 생성 이력 + mini-action turn 추적 | 본인만 |
| `prompt_intents` | 파싱된 프롬프트 의도(JSON) | 본인만 |
| `token_transactions` | 토큰 차감/충전 이력 | 본인만 |
| `plans` | 구독 플랜 정의 | anonymous read |
| `payments` | 결제 이력 (V0 Extended) | 본인만 |

---

## 15.1 users

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Supabase Auth `auth.users.id`와 1:1 |
| `auth_provider` | `text` | not null | 'google', 'kakao', 'naver' |
| `email` | `text` | unique, nullable | OAuth로부터. Kakao 비-비즈앱은 미수집 → null (008) |
| `nickname` | `text` | nullable | 사용자 설정 |
| `plan_type` | `text` | not null, default 'free' | 'free', 'pro' 등 (`plans.code` 참조) |
| `token_balance` | `int` | not null, default 0, **CHECK (`token_balance >= 0`)** | 현재 토큰 잔액. CHECK는 음수 잔액 backstop (ADR-014) |
| `role` | `text` | not null, default 'user' | 'user', 'admin'. 어드민 가드용 (ADR-016) |
| `created_at` | `timestamptz` | not null, default `now()` | |
| `updated_at` | `timestamptz` | not null, default `now()` | trigger로 자동 |

**RLS:** `auth.uid() = id`인 row만 select/update 가능. insert는 trigger로 Supabase Auth와 연동.

**제약·컬럼 보강 (ADR-014·ADR-016):**
- `CHECK (token_balance >= 0)` — 동시 요청·더블클릭으로 RPC 잠금이 뚫리는 극단 경우를 위한 DB 레벨 backstop. 1차 방어는 `consume_tokens()` RPC의 행 잠금(§007). 위반 시 트랜잭션이 롤백되어 음수 잔액이 절대 커밋되지 않음.
- `role` 컬럼 — JWT `app_metadata.role=admin` 클레임과 동기화되는 어드민 식별자. `/api/admin/*` 라우트 가드 + 운영자 전용 쿼리(RLS service_role 경계)와 함께 사용. 기본값 `'user'`, 운영자만 `'admin'`.
- `email` nullable (008 마이그레이션, ADR-019) — 일반(비-비즈) Kakao 앱은 `account_email` 동의항목을 쓸 수 없어(비즈앱 전환·심사 필요) 이메일 없는 가입이 발생한다. NOT NULL을 완화하고 unique는 유지(Postgres는 null을 서로 구별 → 무이메일 가입 다건 허용). 가입 trigger(`handle_new_user`)가 빈 문자열을 null로 정규화. 비즈앱 전환 시 이메일 수집을 다시 켤 수 있다.

---

## 15.2 looks

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `title` | `text` | nullable | 룩 이름 (예: "여름 데이트 꾸안꾸 룩") |
| `base_prompt` | `text` | not null | 사용자 입력 원문 또는 curated 룩의 대표 프롬프트 |
| `generated_image_url` | `text` | not null | **Supabase Storage 경로(또는 서명 URL)만 저장**. OpenAI 생성 URL은 24h 만료되므로 직접 저장 금지 (아래 영속화 규칙 참조) |
| `season` | `text` | nullable | 'spring' / 'summer' / 'fall' / 'winter' / 'all' |
| `situation_tags` | `text[]` | default `{}` | 'date', 'office', 'picnic' 등 표준 enum |
| `mood_tags` | `text[]` | default `{}` | 'casual', 'minimal', 'lovely' 등 |
| `color_tags` | `text[]` | default `{}` | |
| `fit_tags` | `text[]` | default `{}` | 'slim', 'oversized', 'hip-cover' 등 |
| `target_user_tags` | `text[]` | default `{}` | '20s', '30s' 등 |
| `visibility` | `text` | not null, default 'private' | 'private', 'public' |
| `is_curated` | `boolean` | not null, default false | true = 운영자 검수 룩 |
| `created_by` | `uuid` | nullable, FK → users.id | curated 룩은 null 가능 |
| `created_at` | `timestamptz` | not null, default `now()` | |
| `updated_at` | `timestamptz` | not null, default `now()` | |

**RLS:**
- `is_curated = true AND visibility = 'public'` → anonymous read 가능 (Explore 피드)
- `created_by = auth.uid()` → 본인 read/update/delete
- 운영자 어드민은 service_role로 모든 row 접근

**인덱스:**
- `(is_curated, visibility)` — Explore 쿼리 최적화
- `(season, situation_tags)` GIN — 시즌·상황 검색
- `(created_by, created_at DESC)` — 사용자 히스토리

**이미지 영속화 규칙 (A-path 생성, ADR-013 정합):**
- OpenAI GPT Image 2가 반환하는 생성 URL은 **24시간 후 만료**된다. 따라서 생성 직후 즉시 Supabase Storage에 업로드하고, `generated_image_url`에는 Storage 경로(또는 거기서 발급한 서명 URL)를 저장한다. OpenAI URL을 그대로 저장하면 다음 날 깨진 이미지가 된다.
- 토큰은 생성 호출 전에 **선차감**되므로(ADR-014·API_CONTRACTS §3 서버 동작 순서: cap 확인 → `consume_tokens()` 선차감 → 생성 → 실패 시 `refund_tokens()` 환불), 영속화는 응답을 성공으로 확정하기(= 선차감분을 환불하지 않고 확정하기) 전에 완료한다. 3장 all-or-nothing(ADR-014)이므로, 한 장이라도 Storage 저장에 실패하면 부분 성공으로 보지 않고 실패 처리 후 `refund_tokens()`로 환불한다.
- curated 룩(`is_curated=true`)도 동일하게 Storage 경로 보관 (외부 만료 URL 의존 금지).

---

## 15.3 products

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `product_name` | `text` | not null | |
| `brand_name` | `text` | nullable | |
| `source_platform` | `text` | nullable | '29CM', 'MUSINSA', '브랜드자사몰' 등 |
| `product_url` | `text` | not null | 외부 구매 링크 |
| `image_url` | `text` | not null | |
| `price` | `int` | nullable | KRW 정수 |
| `category` | `text` | not null | 'top', 'bottom', 'dress', 'outer' |
| `subcategory` | `text` | nullable | 'shirt', 'denim', 'cardigan' 등 |
| `color` | `text` | nullable | 표준화된 색상명 |
| `fit` | `text` | nullable | 'slim', 'regular', 'oversized' |
| `material` | `text` | nullable | 'cotton', 'linen', 'denim' 등 |
| `mood_tags` | `text[]` | default `{}` | |
| `season_tags` | `text[]` | default `{}` | |
| `situation_tags` | `text[]` | default `{}` | |
| `created_at` | `timestamptz` | not null, default `now()` | |
| `updated_at` | `timestamptz` | not null, default `now()` | |

**RLS:** anonymous read 허용. write는 service_role만 (운영자 어드민).

**인덱스:** `(category, subcategory)`, `(source_platform)`, GIN on `(mood_tags, season_tags, situation_tags)`.

**캡션 컬럼 (확장 예정):** `caption_simple` / `caption_searchable`(AI_PIPELINE §2 캡셔닝 산출물)은 현재 스키마에 없다. V0에선 `data/curated/products.csv` 수집 템플릿에 선수집하고, 컬럼 추가는 V0 부트스트랩(`002_init_looks_products.sql`)에서 실제 수집 데이터로 타입·길이를 검증한 뒤 확정한다 — 10테이블 freeze 원칙상 데이터 없이 컬럼을 미리 열지 않는다. 운영 방식은 `docs/AI_PIPELINE.md` §9.

---

## 15.4 look_products

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `look_id` | `uuid` | not null, FK → looks.id ON DELETE CASCADE | |
| `product_id` | `uuid` | not null, FK → products.id ON DELETE CASCADE | |
| `item_role` | `text` | not null | 'main_top', 'main_bottom', 'main_outer', 'similar', 'related' |
| `recommendation_type` | `text` | not null | 'main_combo', 'similar', 'related' |
| `sort_order` | `int` | not null, default 0 | UI 표시 순서 |
| `created_at` | `timestamptz` | not null, default `now()` | |

**RLS:** look의 정책 상속. unique constraint `(look_id, product_id, item_role)`.

---

## 15.5 saved_looks

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `user_id` | `uuid` | not null, FK → users.id ON DELETE CASCADE | |
| `look_id` | `uuid` | not null, FK → looks.id ON DELETE CASCADE | |
| `visibility` | `text` | not null, default 'private' | 'private', 'public' |
| `created_at` | `timestamptz` | not null, default `now()` | |

**RLS:** `user_id = auth.uid()`. unique `(user_id, look_id)`.

---

## 15.6 generation_history

mini-action 패턴 지원을 위해 TRD 원본 대비 `parent_history_id`·`trigger_type` 추가. 2026-06-01 telemetry 컬럼 `pipeline_source`·`match_score` 추가(B/A 비율·매칭 점수 로깅, UI 비노출 — 새 테이블 아님, 10테이블 freeze 유지).

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `user_id` | `uuid` | not null, FK → users.id ON DELETE CASCADE | |
| `prompt` | `text` | not null | 사용자 입력 또는 mini-action 합성 프롬프트 |
| `interpreted_prompt_id` | `uuid` | nullable, FK → prompt_intents.id | |
| `generated_look_id` | `uuid` | nullable, FK → looks.id | 실패 시 null |
| `status` | `text` | not null | 'pending', 'success', 'failed' |
| `parent_history_id` | `uuid` | nullable, FK → generation_history.id | mini-action turn 추적용 |
| `trigger_type` | `text` | not null, default 'fresh' | 'fresh', 'regenerate', 'chip_refine', 'more_like_this' |
| `pipeline_source` | `text` | nullable | B/A 분기 telemetry: `'curated_only'`/`'mixed'`/`'generated_only'` (API_CONTRACTS 응답 `pipeline_source`와 동일 enum, ADR-012 — UI 노출 X) |
| `match_score` | `real` | nullable | B-path 최고 매칭 가중합 점수 (임계값 0.70·가중치 튜닝 telemetry, `docs/AI_PIPELINE.md` §4) |
| `created_at` | `timestamptz` | not null, default `now()` | |

**RLS:** `user_id = auth.uid()`.

**mini-action 흐름:**
- 다시 생성 → `trigger_type='regenerate'`, `parent_history_id=원래 turn`
- 정제 칩 → `trigger_type='chip_refine'`, `parent_history_id=원래 turn`, `prompt=원래 + 칩 조건`
- More Like This → `trigger_type='more_like_this'`, `parent_history_id=원래 turn`, 별도 메타에 source look_id

---

## 15.7 prompt_intents

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `user_id` | `uuid` | not null, FK → users.id ON DELETE CASCADE | |
| `raw_prompt` | `text` | not null | |
| `parsed_json` | `jsonb` | not null | LLM 파싱 결과 전체 |
| `season` | `text` | nullable | |
| `situation_tags` | `text[]` | default `{}` | |
| `mood_tags` | `text[]` | default `{}` | |
| `budget` | `int` | nullable | KRW 정수 |
| `created_at` | `timestamptz` | not null, default `now()` | |

**RLS:** `user_id = auth.uid()`.

**parsed_json 구조 (예시):**
```json
{
  "season": "summer",
  "situation": ["date", "casual_outing"],
  "mood": ["clean", "lovely"],
  "items_hint": ["린넨셔츠", "세미와이드데님"],
  "colors": ["white", "sky_blue"],
  "fit_hints": ["slim_top", "wide_bottom"],
  "budget_max_krw": 200000,
  "user_size_hints": null
}
```

---

## 15.8 token_transactions

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `user_id` | `uuid` | not null, FK → users.id ON DELETE CASCADE | |
| `transaction_type` | `text` | not null | 'grant', 'spend', 'refund', 'expire' |
| `amount` | `int` | not null | spend는 음수, grant는 양수. **모든 generation spend는 -10 (ADR-012 토큰 단위)** |
| `reason` | `text` | not null | 'demo_prompt', 'generation', 'more_like_this', 'monthly_grant' 등 |
| `related_generation_id` | `uuid` | nullable, FK → generation_history.id | |
| `idempotency_key` | `text` | nullable | 클라이언트 `X-Idempotency-Key` 헤더 값. **`unique(user_id, idempotency_key)`** (ADR-014). spend·refund 거래에 필수, grant/expire 등 cron 거래는 null 허용 |
| `created_at` | `timestamptz` | not null, default `now()` | |

**RLS:** `user_id = auth.uid()` read만. write는 service_role (서버에서만 트리거).

**제약·멱등성 (ADR-014):**
- `unique(user_id, idempotency_key)` — 동일 사용자가 같은 멱등성 키로 재요청하면(더블클릭·네트워크 재시도) insert가 unique 위반으로 막혀 이중 차감이 발생하지 않는다. 서버는 위반을 감지하면 기존 거래의 결과를 캐시 응답으로 돌려준다(중복 차감 없음).
- `idempotency_key`는 spend(`generation`·`more_like_this`·`demo_prompt`)와 그 환불(refund)에 필수. 환불 거래는 원 spend 키에서 파생한 키(예: `<key>:refund`)로 멱등 보장. cron grant·expire 등 서버 배치 거래는 키 없이(null) 허용 — partial unique index `WHERE idempotency_key IS NOT NULL`로 다수 null을 허용한다.
- **ADR-012 불변**: 이 멱등성 컬럼은 차감 "방식"의 안전장치일 뿐, 1회 검색=10토큰·항상 룩 3개 차감 "양/개수"는 그대로다.

---

## 15.9 plans

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `code` | `text` | PK | 'free', 'pro', 'max' |
| `display_name` | `text` | not null | 한국어 표시명 |
| `monthly_token_grant` | `int` | not null, default 0 | 토큰 그랜트량. **의미는 ADR-012 참조** (free=가입 시 1회만, Pro/Max=매월 1일 cron grant + 익월 expire) |
| `monthly_price_krw` | `int` | not null, default 0 | |
| `max_saved_looks` | `int` | nullable | null = 무제한 |
| `features` | `jsonb` | not null, default `'{}'` | 기능 플래그 |
| `is_active` | `boolean` | not null, default true | |
| `created_at` | `timestamptz` | not null, default `now()` | |

**RLS:** anonymous read 허용.

**V0 초기 데이터 (ADR-012 기준):**
- `('free', '무료', 10, 0, 5, '{}', true)` — 가입 시 1회 10토큰(=1회 검색), saved 5개 누적 슬롯
- `('pro', 'Pro', 100, 9900, 5, '{"advanced_filters":true}', true)` — V0 Extended, 월 100토큰(=10회 검색), saved 5개 슬롯
- `('max', 'Max', 200, 19900, null, '{"advanced_filters":true,"unlimited_saved":true}', true)` — V0 Extended, 월 200토큰(=20회 검색), saved 무제한

---

## 15.10 payments (V0 Extended)

V0 Core에서는 사용하지 않음. V0 Extended/V1 도입 시 활성화.

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `user_id` | `uuid` | not null, FK → users.id | |
| `plan_code` | `text` | not null, FK → plans.code | |
| `provider` | `text` | not null | 'toss', 'kakaopay' 등 |
| `provider_payment_id` | `text` | not null | PG 트랜잭션 ID |
| `amount_krw` | `int` | not null | |
| `status` | `text` | not null | 'pending', 'paid', 'failed', 'refunded' |
| `paid_at` | `timestamptz` | nullable | |
| `created_at` | `timestamptz` | not null, default `now()` | |

**RLS:** `user_id = auth.uid()` read만. write는 service_role.

---

## 15.11 RLS 정책 전수 (006_rls_policies.sql 미리보기)

> ADR-016. `006_rls_policies.sql`은 **전 테이블 RLS enable**을 일괄 적용한다. 공통 원칙: **읽기는 본인/공개만, 쓰기는 전부 service_role(서버 라우트)만**. 클라이언트가 anon/authenticated 키로 직접 INSERT/UPDATE/DELETE 하는 경로는 없다(API 키 노출 방지 CRITICAL과 정합).

각 테이블 정책 요약 (모든 테이블 `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`):

| 테이블 | SELECT (read) | INSERT/UPDATE/DELETE (write) |
|---|---|---|
| `users` | `auth.uid() = id` 본인만 | service_role만 (가입 trigger·서버 라우트) |
| `looks` | `is_curated AND visibility='public'` anon read + `created_by = auth.uid()` 본인 | service_role만 (생성·curated 등록) |
| `products` | anon read 허용 | service_role만 (운영자 어드민) |
| `look_products` | look 정책 상속 (공개·본인 look의 매핑만) | service_role만 |
| `saved_looks` | `user_id = auth.uid()` 본인만 | service_role만 |
| `generation_history` | `user_id = auth.uid()` 본인만 | service_role만 |
| `prompt_intents` | `user_id = auth.uid()` 본인만 | service_role만 |
| `token_transactions` | `user_id = auth.uid()` 본인만 | service_role만 (RPC 경유) |
| `plans` | anon read 허용 | service_role만 |
| `payments` | `user_id = auth.uid()` 본인만 | service_role만 |

- **service_role 경계**: 모든 write는 `src/app/api/` 서버 라우트가 service_role 키로 수행한다. RLS는 클라이언트 직접 쓰기를 원천 차단하는 마지막 방어선.
- **어드민 가드 (ADR-016)**: 운영자 전용 작업(`products` 등록, curated `looks` 검수)은 JWT `app_metadata.role=admin` + `users.role='admin'` 확인 후 `/api/admin/*`에서 service_role로 수행. RLS 정책 자체는 service_role을 신뢰하므로, 어드민 권한 검사는 라우트 레벨에서 한다.
- **가입 grant 멱등 (ADR-016)**: Supabase Auth trigger가 신규 가입 시 1회만 10토큰(ADR-012)을 부여한다. trigger 내 `INSERT ... ON CONFLICT DO NOTHING`으로 재실행·중복 이벤트에도 한 번만 grant되게 한다.

---

## 15.12 토큰 RPC 명세 (007_token_rpc.sql)

> ADR-014. 동시 요청·더블클릭에서 이중 차감·음수 잔액·환불 누락을 막기 위해, 토큰 차감/환불을 **단일 Postgres 트랜잭션 + 행 잠금**으로 처리하는 두 RPC를 추가한다. 추가 인프라(분산락·외부 큐) 없이 Supabase 단독으로 정합성을 확보한다. **새 테이블은 만들지 않는다** — 기존 `users`·`token_transactions`만 사용.

### `consume_tokens()`

- **시그니처(개념)**: `consume_tokens(p_user_id uuid, p_amount int, p_reason text, p_idempotency_key text, p_related_generation_id uuid) RETURNS token_transactions`
- **속성**: `SECURITY DEFINER` (RLS를 우회해 service_role 경계 안에서만 실행). 서버 라우트만 호출.
- **동작 (한 트랜잭션)**:
  1. `SELECT ... FROM users WHERE id = p_user_id FOR UPDATE` — 해당 사용자 행을 잠가 동시 차감을 직렬화.
  2. 멱등성 체크: `(p_user_id, p_idempotency_key)`로 기존 `token_transactions`가 있으면 **차감 없이 그 거래를 그대로 반환**(중복 차감 방지).
  3. 잔액 확인: `token_balance < p_amount`이면 잔액 부족 에러(서버는 402 매핑, API_CONTRACTS).
  4. `INSERT INTO token_transactions (...) ` — `transaction_type='spend'`, `amount = -p_amount`(음수), `reason`, `idempotency_key`, `related_generation_id`.
  5. `UPDATE users SET token_balance = token_balance - p_amount` — `CHECK (token_balance >= 0)`가 최종 backstop.
- **호출 시점**: `/api/looks/generate`·`/more-like-this`가 **생성 호출 전 선차감**으로 1회(API_CONTRACTS §3 서버 동작 순서 — cap 확인 → `consume_tokens()` 선차감 → 생성 → 부분실패 시 `refund_tokens()` 환불). `p_amount`는 항상 10 (ADR-012 불변).

### `refund_tokens()`

- **시그니처(개념)**: `refund_tokens(p_user_id uuid, p_amount int, p_idempotency_key text, p_related_generation_id uuid) RETURNS token_transactions`
- **속성**: `SECURITY DEFINER`. 서버 라우트만 호출.
- **동작 (한 트랜잭션)**:
  1. `SELECT ... FOR UPDATE`로 사용자 행 잠금.
  2. 멱등성 체크: 환불 키(예: 원 spend 키 + `:refund`)로 기존 환불 거래가 있으면 그대로 반환(이중 환불 방지).
  3. `INSERT INTO token_transactions (...)` — `transaction_type='refund'`, `amount = +p_amount`(양수), `reason='generation'`(원 사유 승계), `idempotency_key`, `related_generation_id`.
  4. `UPDATE users SET token_balance = token_balance + p_amount` — 잔액 복구.
- **환불 트리거 (3장 all-or-nothing)**: AI 생성 실패 또는 룩 3장 미달(부분 성공) 시 부분 성공으로 보지 않고 **실패 처리 후 자동 환불**한다. 한 검색=10토큰 단위이므로 부분 환불은 없다(전액 10토큰 환불).

> **ADR-012 정합**: 위 RPC는 차감 "방식"의 안전장치다. 차감 "양/개수"(1회 검색=10토큰=룩 3개, 서버 항상 3개)는 변경하지 않는다.

---

## 15.13 비용 안전장치 설정값 — env (테이블 아님)

> ADR-015. 전역 일일 spend cap·수동 kill switch의 **설정값은 환경변수(env)에 둔다**. `app_config` 같은 새 테이블을 만들지 않는다(10테이블 freeze 유지).

- **일일 cap 카운트 출처**: 당일 생성 호출 수는 별도 카운터 테이블 없이 **`generation_history`의 당일치(`created_at`) 행 수 조회**로 계산한다. 상한 초과 시 `/api/looks/generate`가 503으로 안내(API_CONTRACTS).
- **env 변수(예시)**:
  - `DAILY_GENERATION_CAP` — 전역 일일 생성 호출 상한(이미지/검색 기준). 초기값 예시: 정상 일평균(~33 검색/일 = ~100 이미지)의 약 5~6배(예: 일 200 검색 = 600 이미지). 실트래픽으로 조정.
  - `GENERATION_KILL_SWITCH` — `on`/`off`. on이면 전체 생성 즉시 차단(비상장치). 토글 시 Vercel 재배포 ~1분 소요(드물게 사용하는 비상장치라 수용).
- **트레이드오프(ADR-015)**: env 선택 = 10테이블 freeze 유지·가장 단순. 비개발 운영자가 무재배포로 토글해야 하거나 토글이 잦아지면 그때 `app_config` 테이블로 승격 재검토.
- **ADR-003·ADR-012 정합**: 단가($0.053=74원/이미지)·마진 수치는 건드리지 않는다 — runaway "상한"만 추가.

---

## 마이그레이션 권고

V0 부트스트랩 시 다음 순서로 마이그레이션:

1. `001_init_users.sql` — users (`CHECK token_balance >= 0`·`role` 포함) + 가입 grant 멱등 Supabase Auth trigger
2. `002_init_looks_products.sql` — looks, products, look_products
3. `003_init_saved_history.sql` — saved_looks, generation_history (parent_history_id 포함), prompt_intents
4. `004_init_tokens_plans.sql` — token_transactions (`idempotency_key`·`unique(user_id, idempotency_key)` 포함), plans + free/pro/max 시드
5. `005_init_payments.sql` — payments (V0 Extended)
6. `006_rls_policies.sql` — 전 테이블 RLS enable + 정책 일괄 적용 (읽기 본인/공개, 쓰기 service_role — §15.11)
7. `007_token_rpc.sql` — `consume_tokens()`·`refund_tokens()` RPC (행 잠금·멱등성·환불 — §15.12)

각 마이그레이션은 local → staging → production 순서로 검증. 일일 cap·kill switch 설정값은 마이그레이션이 아니라 **env 환경변수**로 관리한다(§15.13, 새 테이블 없음).

## 변경 이력

- 2026-05-17: 초기 작성 (TRD 15장 promote). `generation_history`에 mini-action 추적용 `parent_history_id`, `trigger_type` 컬럼 추가.
- 2026-06-01: 백엔드 V0 안전 보강 (ADR-013~017). `users`에 `CHECK (token_balance >= 0)`·`role` 컬럼 추가, `token_transactions`에 `idempotency_key`·`unique(user_id, idempotency_key)` 추가, `looks.generated_image_url` Storage 경로 영속화 규칙 명시(OpenAI URL 24h 만료 대응). §15.11 RLS 전수 정책(006), §15.12 토큰 RPC 명세(007 `consume_tokens`/`refund_tokens`), §15.13 비용 안전장치 env 설정값(테이블 추가 없음) 신설. `generation_history`에 telemetry 컬럼 `pipeline_source`·`match_score` 추가(B/A 비율·매칭 점수 로깅, UI 비노출). 10테이블 freeze·ADR-012 차감 양 불변 유지.
