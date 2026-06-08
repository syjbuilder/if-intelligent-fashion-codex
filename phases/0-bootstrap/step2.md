# Step 2: supabase-client

## Files To Read
Baseline: `CLAUDE.md`, `docs/ARCHITECTURE.md`, `docs/ADR.md`
Security: `docs/ADR.md` ADR-016(RLS·service_role·어드민 경계), `docs/DATA_MODEL.md` §15.11
env 목록: `docs/ARCHITECTURE.md` §환경/마이그레이션 절차
Prior: step 0(env.example), step 1(`src/types/db.ts`)

## Task
Supabase 연결 클라이언트를 **보안 경계와 함께** 만든다. **TDD: 테스트 먼저.**

- dep 추가: `@supabase/supabase-js`(+ 필요 시 `@supabase/ssr`).
- `src/lib/supabase/browser.ts` — `createBrowserClient()`: `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`만 사용(RLS로 보호). 브라우저/클라이언트 컴포넌트 전용.
- `src/lib/supabase/server.ts` — `createServerClient()`: 서버 영역 전용. anon 또는 `SUPABASE_SERVICE_ROLE_KEY`(어드민 작업) 사용. **service_role은 서버에서만** — 모듈 상단에 `import 'server-only'` 또는 `typeof window !== 'undefined'`면 throw하는 가드로 클라이언트 번들 유입 차단(ADR-016).
- `src/services/` 경계: 외부 API 래퍼가 살 자리 stub(`src/services/README.md` 또는 index). 외부 호출은 여기/`src/app/api`에서만.
- **테스트 먼저**: `src/lib/supabase/__tests__/server.test.ts`·`browser.test.ts` — mocked env로 ① 팩토리가 설정된 클라이언트 반환 ② server 모듈의 service_role 가드가 클라이언트 컨텍스트에서 throw하는지(키 누출 방지) 검증.

불변: 클라이언트 컴포넌트에서 server/service_role import 금지. 키 하드코딩 금지(env만).

## Acceptance Criteria
```bash
npm run lint
npm run build
npm test
```

## Verification
1. 위 통과. 테스트가 service_role 누출 가드를 실제로 검증.
2. CLAUDE.md CRITICAL(외부 API는 서버 영역만, 키 노출 방지)·ADR-016 준수.
3. `phases/0-bootstrap/index.json` step 2 → `completed` + 요약.

## Prohibited
- service_role 키를 `NEXT_PUBLIC_*`로 노출하거나 클라이언트 번들에 포함 금지. 이유: 전체 DB 권한 탈취.
- 실제 키를 코드/커밋에 넣지 말 것(.env.local만, gitignore). 기존 테스트 깨지 말 것.
