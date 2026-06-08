# Step 5: db-apply-smoke

## Files To Read
Baseline: `CLAUDE.md`, `docs/ARCHITECTURE.md`, `docs/ADR.md`
DB: `docs/DATA_MODEL.md` §15(전체), "마이그레이션 권고", `docs/ARCHITECTURE.md` §환경/마이그레이션 절차
Prior: step 3·4 마이그레이션(001~007), step 2 supabase 클라이언트

## PRECONDITION (PO 작업)
호스티드 Supabase 프로젝트가 생성돼 있고 키가 `.env.local`에 있어야 한다:
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
**키가 없으면**: `phases/0-bootstrap/index.json` step 5 → `status: "blocked"`, `blocked_reason: "PO가 Supabase 프로젝트 생성 + .env.local 키 필요"` 로 두고 **정지**(여기까지 0~4 완료 상태).

## Task
마이그레이션 001~007을 호스티드 Supabase(=staging)에 적용하고 스모크 검증한다. production 직접 쿼리 금지(CLAUDE.md) — 이 프로젝트를 staging으로 다룬다.

- 적용: Supabase CLI(`supabase link` → `supabase db push`) 또는 SQL 에디터로 001~007 순서 적용.
- 스모크(`scripts/smoke.test.ts` 또는 vitest 통합 테스트 — 파일명에 `test` 포함해 가드 면제): service_role로 연결해
  ① 10테이블 전부 존재 ② `plans`에 free/pro/max 시드 ③ 전 테이블 RLS enabled ④ `consume_tokens()`/`refund_tokens()` 호출 가능(멱등성 키 재호출 시 중복 차감 0).

불변: `.env.local`/키는 절대 커밋 금지(secret-guard).

## Acceptance Criteria
```bash
npm run lint
npm run build
npm test   # 스모크 포함 (키 있을 때)
```

## Verification
1. 위 통과. 스모크 4항목 전부 green.
2. 적용 순서·RLS·RPC가 DATA_MODEL §15와 일치. CLAUDE.md(프로덕션 직접 쿼리 금지) 준수.
3. `phases/0-bootstrap/index.json` step 5 → `completed`(+요약) 또는 `blocked`(키 대기).

## Prohibited
- `.env.local`/service_role 키 커밋 금지. 이유: 전체 DB 탈취·CRITICAL.
- production DB 직접 변경 금지. 기존 테스트 깨지 말 것.
