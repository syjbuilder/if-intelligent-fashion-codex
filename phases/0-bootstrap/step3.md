# Step 3: migrations-schema

## Files To Read
Baseline: `CLAUDE.md`, `docs/ARCHITECTURE.md`, `docs/ADR.md`
DB: `docs/DATA_MODEL.md` §15.1~15.10 + §15.3 캡션 메모 + "마이그레이션 권고"(001~007)
캡션: `docs/AI_PIPELINE.md` §9
Prior: step 1 타입(`src/types/db.ts`)과 컬럼 정합

## Task
`supabase/migrations/`에 스키마 SQL `001`~`005`를 DATA_MODEL §15 정확히 반영해 작성한다. (`.sql` — TDD 가드 무관.)

- `001_init_users.sql` — `users` (`CHECK (token_balance >= 0)`, `role`, `plan_type` default 'free'). 가입 grant 멱등 trigger(`ON CONFLICT DO NOTHING`로 1회 10토큰, ADR-016). `updated_at` 트리거.
- `002_init_looks_products.sql` — `looks`, `products`, `look_products`. **`products`에 `caption_simple text`·`caption_searchable text` 컬럼 포함**(부트스트랩 확정 지점, §15.3 메모). 인덱스(§15.2~15.4), `look_products` UNIQUE(look_id, product_id, item_role).
- `003_init_saved_history.sql` — `saved_looks`, `generation_history`(`parent_history_id`, `trigger_type`, `pipeline_source`, `match_score`), `prompt_intents`.
- `004_init_tokens_plans.sql` — `token_transactions`(`idempotency_key`, `unique(user_id, idempotency_key)`), `plans` + 시드: free(10/0/5), pro(100/9900/5), max(200/19900/null) — DATA_MODEL §15.9 정확히.
- `005_init_payments.sql` — `payments`(V0 Extended).

불변: 10테이블만(새 테이블 금지). 컬럼·타입·제약·기본값은 DATA_MODEL과 1:1. RLS·RPC는 step 4.

## Acceptance Criteria
```bash
npm run lint
npm run build
npm test
```
(SQL은 빌드/테스트 대상 아님 — 적용·스모크는 step 5. 본 step은 파일 정합 점검.)

## Verification
1. 위 통과(코드 회귀 없음).
2. 각 SQL의 테이블·컬럼·제약·인덱스·시드가 DATA_MODEL §15와 정확히 일치. 002에 캡션 2컬럼 존재. plans 시드 값 정확.
3. step 1 타입과 컬럼명 불일치 0.
4. `phases/0-bootstrap/index.json` step 3 → `completed` + 요약.

## Prohibited
- 새 테이블/컬럼을 DATA_MODEL 없이 추가 금지. 이유: 10테이블 freeze·스키마 정본 이탈.
- 토큰 양·요금제 수치 변경 금지(ADR-012/003 불변). 기존 테스트 깨지 말 것.
