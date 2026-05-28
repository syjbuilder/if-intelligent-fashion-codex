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
| `email` | `text` | unique, not null | OAuth로부터 |
| `nickname` | `text` | nullable | 사용자 설정 |
| `plan_type` | `text` | not null, default 'free' | 'free', 'pro' 등 (`plans.code` 참조) |
| `token_balance` | `int` | not null, default 0 | 현재 토큰 잔액 |
| `created_at` | `timestamptz` | not null, default `now()` | |
| `updated_at` | `timestamptz` | not null, default `now()` | trigger로 자동 |

**RLS:** `auth.uid() = id`인 row만 select/update 가능. insert는 trigger로 Supabase Auth와 연동.

---

## 15.2 looks

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | `uuid` | PK | |
| `title` | `text` | nullable | 룩 이름 (예: "여름 데이트 꾸안꾸 룩") |
| `base_prompt` | `text` | not null | 사용자 입력 원문 또는 curated 룩의 대표 프롬프트 |
| `generated_image_url` | `text` | not null | Supabase Storage URL 또는 외부 CDN |
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

mini-action 패턴 지원을 위해 TRD 원본 대비 컬럼 2개 추가 (`parent_history_id`, `trigger_type`).

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
| `created_at` | `timestamptz` | not null, default `now()` | |

**RLS:** `user_id = auth.uid()` read만. write는 service_role (서버에서만 트리거).

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

## 마이그레이션 권고

V0 부트스트랩 시 다음 순서로 마이그레이션:

1. `001_init_users.sql` — users + Supabase Auth trigger
2. `002_init_looks_products.sql` — looks, products, look_products
3. `003_init_saved_history.sql` — saved_looks, generation_history (parent_history_id 포함), prompt_intents
4. `004_init_tokens_plans.sql` — token_transactions, plans + free/pro 시드
5. `005_init_payments.sql` — payments (V0 Extended)
6. `006_rls_policies.sql` — 모든 RLS 정책 일괄 적용

각 마이그레이션은 local → staging → production 순서로 검증.

## 변경 이력

- 2026-05-17: 초기 작성 (TRD 15장 promote). `generation_history`에 mini-action 추적용 `parent_history_id`, `trigger_type` 컬럼 추가.
