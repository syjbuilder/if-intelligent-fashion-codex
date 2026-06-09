# Step 2: shared-primitives

## Files To Read
step1 결과(토큰·setup stub), `docs/UI_GUIDE.md`, `디자인/if-homepage-v0.7.html`(.brand/.cta/.chip/.explore-card/가먼트 SVG), `src/types/ui.ts`.

## Task (전부 TDD — 구현 전 같은 폴더 `__tests__/{base}.test.tsx` 먼저 Write)
- `src/lib/looks-fixtures.ts` + **`src/lib/__tests__/looks-fixtures.test.ts`**(이름 정확히 base 일치 — 가드 차단 방지):
  curated 6 + explore 12 룩(tone-office/date/sport a~d, 캡션, 프롬프트) + **products mock**(4카테고리 top/bottom/outer/dress + ₩가격 + 외부 링크 placeholder). 하드코딩 상수, 외부 호출 0.
- `src/components/brand/BrandMark.tsx`: 'IF'(24px 800 ls -0.04em) + 'INTELLIGENT FASHION'(9px 800 ls 0.24em). Server Component.
- `src/components/ui/Cta.tsx`: pill min 200×56, full radius, t6 800 uppercase. variant `accent`(.cta-accent 글래스 rgba(var(--accent-rgb),.55) blur)/`dark`/`gate`. href→`<a>` 없으면 `<button>`. onClick prop.
- `src/components/ui/Chip.tsx`: 기본(다크 반투명 흰)/`season`/`refine`(솔리드 #fff + ink border). label + onClick prop.
- `src/components/looks/GarmentSvg.tsx`: 가먼트 라인 SVG, `stroke=currentColor`, `vector-effect non-scaling-stroke`, tone별 variant. **사람/얼굴/인종 마커 0(ADR-006).**
- `src/components/looks/LookCard.tsx`: aspect 3/4, radius card(4px), tone 그라디언트 bg + GarmentSvg + card-tag(좌하) + card-prompt(우하 작은 캡션 — 이미지보다 강조 X). onClick prop(자체 fetch 0).
- `src/components/motion/useReveal.ts` + 테스트: IntersectionObserver 기반 reveal/section-in 진입 + `prefers-reduced-motion` 가드(즉시 visible) + reveal-words 단어 분해 유틸.

## Tests-first 요점
BrandMark(두 텍스트), Cta(variant 클래스+label, fireEvent click→onClick), Chip(label+click), LookCard(tone/variant→tone 클래스, tag/prompt 텍스트, GarmentSvg 포함), useReveal(setup stub 사용, reduced-motion 시 즉시 visible), looks-fixtures(curated 6·explore 12·products 길이/구조). **user-event 미설치 → fireEvent.**

## Acceptance
`npm test`(신규 테스트 전부 green) + lint. 모든 .tsx/.ts 가드 통과(테스트 선행). LookCard tone 클래스 정확.

## Anti-patterns
사람 사진/얼굴 0. card-prompt 캡션 작게. italic/scaleX/rotate 0. Cta 200×56 터치. 정적 import만(한글경로 동적 import 회피). 외부 호출 0.
