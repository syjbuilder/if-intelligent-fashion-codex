# Step 1: design-tokens-and-fonts

## Files To Read
`CLAUDE.md`, `docs/UI_GUIDE.md`(타이포 7원칙·안티패턴), `디자인/if-homepage-v0.7.html`(토큰 출처),
현재 `tailwind.config.ts`·`src/app/{layout.tsx,page.tsx,globals.css}`·`src/test/setup.ts`·`vitest.config.ts`.

## Task
디자인 시스템 토대를 v0.7로 교체. 이후 모든 컴포넌트가 깨끗한 토큰 위에 올라가도록.

- `tailwind.config.ts` theme.extend:
  - colors: `ink #1a1a1a`, `ink-soft #4a4a48`, `muted #8a8a86`, `paper #f5f5f3`, `cream #eaeae6`,
    `white-soft #fbfbfa`(Tailwind 기본 white와 충돌 회피), `accent #3d4f6b`, `line rgba(26,26,26,0.10)`, `slate-body #5a5f68`.
  - fontFamily: `display`=`body`=`['var(--font-inter)','Pretendard Variable','Pretendard','system-ui','-apple-system','BlinkMacSystemFont','sans-serif']`.
  - fontSize: `t1 clamp(48px,7vw,96px)`, `t2 clamp(40px,5.4vw,72px)`, `t3 clamp(24px,2.4vw,32px)`, `t4 18px`, `t5 16px`, `t6 13px`, `t7 12px`, `t8 11px`.
  - transitionTimingFunction: `smooth cubic-bezier(0.22,1,0.36,1)`, `expo cubic-bezier(0.16,1,0.3,1)`.
  - borderRadius: `card 4px` (pill = 기본 `full`/999px).
  - screens: 기본 + (필요 시) 사용. **font-medium(500)·font-bold(700) 사용 금지** — normal/semibold/extrabold만.
- `src/app/layout.tsx`: `next/font/google` **Inter**(subsets latin, weight [400,600,800], variable `--font-inter`)만 로드.
  `<html lang="ko" className={inter.variable}>`, `<body className="font-body antialiased bg-paper text-ink">`.
  `<head>`에 Pretendard `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">`.
  **Playfair/Manrope import 전부 제거.** metadata 유지.
- `src/app/globals.css`: `@tailwind base/components/utilities` + `@layer base`(`html{scrollbar-gutter:stable}`,
  body 기본색) + `:root{ --accent-rgb:61,79,107 }` + 클래스 `.bg-hero-dark`/`.bg-slate-scene`(3-layer radial+linear) +
  grain `::after`(SVG feTurbulence data-uri, mix-blend overlay; hero .06 / slate .08) +
  `@media (prefers-reduced-motion:reduce){ *,*::after{ animation-duration:1ms!important; transition-duration:1ms!important } }`.
- `src/test/setup.ts`: 기존 jest-dom import + **`vi.stubGlobal('IntersectionObserver', class{ observe(){} unobserve(){} disconnect(){} takeRecords(){return []} })`** +
  `window.matchMedia` mock(특히 `(prefers-reduced-motion: reduce)` → matches false 기본). jsdom에 IO·matchMedia 없음 → 모든 모션 컴포넌트 테스트 전제.
- `src/types/ui.ts`: `LookTone = 'office'|'date'|'sport'`, `LookVariant = 'a'|'b'|'c'|'d'`, `CuratedLook`/`ExploreLook`/`ProductMock`/`SocialProvider` 등 셸 props 타입(db.ts enum과 중복 없이 UI 전용).
- `src/app/page.tsx`: 임시 hero placeholder('Style your Imagination.' h1 + kicker) — step3에서 최종 교체. 외부 호출 0.
- `src/app/__tests__/smoke.test.tsx`: `render(<Home/>)` 후 **'Style your Imagination.'** heading 단언(layout className 단언 금지 — RSC).

## Acceptance
`npm run lint && npm run build && npm test` 통과(.next 정리 후). tailwind에 ink~accent+t1~t8 존재, layout이 Inter만 로드+Pretendard link,
globals에 .bg-hero-dark/.bg-slate-scene/reduced-motion/scrollbar-gutter, setup.ts에 IO/matchMedia stub.

## Anti-patterns / Prohibited
Playfair/Manrope 잔존 0. font 500/700 클래스 0. 중성톤을 Tailwind 기본 팔레트로 치환 금지(정확 hex). 워밍 브라운/에스프레소 rgba 0.
backdrop-filter(글래스)는 의도적 허용 — 제거 금지. 시크릿/외부 호출 0.
