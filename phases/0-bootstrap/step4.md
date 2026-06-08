# Step 4: migrations-rls-rpc

## Files To Read
Baseline: `CLAUDE.md`, `docs/ARCHITECTURE.md`, `docs/ADR.md`
DB: `docs/DATA_MODEL.md` §15.11(RLS 전수), §15.12(토큰 RPC)
ADR: ADR-014(토큰 RPC·멱등성·환불), ADR-016(RLS·service_role)
Prior: step 3 스키마(001~005)

## Task
`supabase/migrations/`에 `006`·`007`을 작성한다. (`.sql` — TDD 가드 무관.)

- `006_rls_policies.sql` — 전 테이블 RLS enable + 정책(§15.11):
  - anon read 허용: `looks`(`is_curated=true AND visibility='public'`), `products`, `plans`.
  - 본인만: `saved_looks`/`generation_history`/`prompt_intents`/`token_transactions`(`user_id = auth.uid()`), `users`(본인 행).
  - 쓰기는 전부 service_role(서버 라우트)만. `look_products`는 look 정책 상속.
- `007_token_rpc.sql` — `consume_tokens(p_user_id, p_amount, p_idempotency_key, ...)` + `refund_tokens(...)` (SECURITY DEFINER, §15.12):
  - `SELECT ... FOR UPDATE`로 `users` 행 잠금 → 잔액 확인 → `token_transactions` insert(멱등성 키 unique) → balance update를 한 트랜잭션.
  - 같은 멱등성 키 재호출은 캐시된 결과 반환(중복 차감 0). `p_amount`는 호출부에서 항상 10(ADR-012 불변).
  - `refund_tokens`는 환불 거래 기록 + 잔액 복구(3장 all-or-nothing 실패 대응).

불변: ADR-012 차감 양(10)·"항상 3개"는 안 건드림 — 차감 "방식"만 안전화.

## Acceptance Criteria
```bash
npm run lint
npm run build
npm test
```
(적용·동작 검증은 step 5.)

## Verification
1. 위 통과.
2. RLS 정책이 §15.11과 일치(읽기 본인/공개, 쓰기 service_role). RPC 시그니처·잠금·멱등성·환불이 §15.12·ADR-014와 일치.
3. `phases/0-bootstrap/index.json` step 4 → `completed` + 요약.

## Prohibited
- RLS 없이 테이블 노출 금지. 이유: 데이터 유출.
- 토큰 양/개수 정책 변경 금지(ADR-012). 기존 테스트 깨지 말 것.
