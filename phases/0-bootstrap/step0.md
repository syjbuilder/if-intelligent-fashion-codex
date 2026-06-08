# Step 0: project-setup

## Files To Read
Baseline: `CLAUDE.md`, `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/ADR.md`, `docs/UI_GUIDE.md`
Navigation: `docs/DOC_MAP.md`

## Task
Next.js 앱 골조 + 도구를 깐다 (UI 기능 아님, 인프라).

- `package.json` — name `if-web`, private. scripts: `dev`(next dev), `build`(next build), `start`(next start), `lint`(next lint), `test`(vitest run), `test:watch`(vitest). deps: next(App Router), react, react-dom. devDeps: typescript, @types/*, tailwindcss/postcss/autoprefixer, eslint+eslint-config-next, vitest, @vitejs/plugin-react, jsdom, @testing-library/react, @testing-library/jest-dom.
- `next.config.mjs`, `tsconfig.json`(strict, paths `@/*` → `src/*`), `.eslintrc.json`(next/core-web-vitals), `tailwind.config.ts`(content `src/**`, fontFamily `playfair`/`manrope` CSS 변수), `postcss.config.mjs`.
- `vitest.config.ts`(environment jsdom, globals true, setupFiles `src/test/setup.ts`, alias `@`→`src`), `src/test/setup.ts`(`@testing-library/jest-dom` import).
- `src/app/layout.tsx` — `next/font/google`로 Playfair Display·Manrope 로드, `--font-playfair`/`--font-manrope` CSS 변수 노출. `src/app/page.tsx` — 최소 히어로("Wear what you imagine." 등). `src/app/globals.css` — `@tailwind base/components/utilities` + 폰트 변수 매핑.
- `src/app/__tests__/smoke.test.tsx` — `page.tsx`가 알려진 문구를 렌더하는지 검증.
- 디렉토리 뼈대: `src/{components,lib,services,types}/.gitkeep`.
- `.env.example` — `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `DAILY_GENERATION_CAP`(예 600), `GENERATION_KILL_SWITCH`(off). 값은 placeholder만(시크릿 금지).
- `.gitignore`에 `.env*`(단 `!.env.example`), `.next/`, `node_modules/`, 빌드·캐시 포함 확인.
- pre-commit 활성화: `git config core.hooksPath .githooks` 1회 실행.

불변: `src/` 구조(CLAUDE.md). TS strict. 외부 API 호출 코드 없음.

## Acceptance Criteria
```bash
npm install
npm run lint
npm run build
npm test
```

## Verification
1. 위 명령 전부 통과.
2. ARCHITECTURE 디렉토리 규칙(`src/{app,components,lib,services,types}`) 준수. ADR-002 스택(Next.js+TS+Tailwind) 준수. CLAUDE.md CRITICAL(시크릿 커밋 금지) 준수.
3. `phases/0-bootstrap/index.json` step 0 → `completed` + 요약.

## Prohibited
- `.env`(실값) 커밋 금지. 이유: 시크릿 노출(secret-guard·CRITICAL).
- V0 범위 밖 기능(업로드·결제·크롤러) 추가 금지.
- 기존 테스트 깨뜨리지 말 것.
