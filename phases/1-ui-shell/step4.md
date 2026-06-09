# Step 4: studio-shell-scenes (/studio)

## Files To Read
step1~3 결과, `디자인/if-homepage-v0.7.html`(.studio/.scene-explore/.scene-loading/.scene-results/carousel/dock/mini-action), `docs/ADR.md` ADR-009, `docs/UI_GUIDE.md`.

## Task (TDD — 테스트 먼저)
- `src/components/studio/PromptDock.tsx`(Client): pill, 48px dock-btn + 한글 placeholder input(value/onChange 제어) + ↑ generate(onSubmit prop, 외부 호출 0). **`tokens_insufficient` prop → generate 비활성 + 안내 슬롯(단일 차단 상태, 카운터·'무료' 변동표시 금지 — ADR-009/014, D8).**
- `src/components/studio/ExploreScene.tsx`(Client): brand-strip + sticky PromptDock + **season-prompts Chip 5**(봄 데이트룩 등) + 'Curated for this week' + explore-grid LookCard 12(fixtures). 칩/카드 클릭→입력값 채움(useState)까지만(생성 X). fixtures 0건 가드(빈 그리드 방지).
- `src/components/studio/LoadingScene.tsx`(Client): `.bg-slate-scene` + loading-title 'Reading the silhouette' + **진행 텍스트 노출(빈 화면 금지)** + fashion-lines 옷걸이 SVG(lineDraw).
- `src/components/studio/ResultsScene.tsx`(Client): 풀블리드 carousel 3 slide(office/date/sport, --paper) + GarmentSvg + slide-meta(tag/title/desc/actions) + carousel-nav(←→ useState index) + **mini-action 3(다시 생성 / refine Chip(새 turn 자리) / More Like This) + View products(onOpenDrawer)**. 룩 보드 먼저(상품 그리드 먼저 X), 텍스트가 가먼트보다 강조 X.
- `src/app/studio/page.tsx`(Client shell): **useReducer scene 상태머신 `explore→loading→results→error`**(error=재시도 CTA 자리, D8) + drawer open + auth/history overlay open + mock isLoggedIn. 하위에 prop 주입, 외부 호출 0.

## Tests-first 요점
PromptDock(input 제어 fireEvent.change, generate→onSubmit, tokens_insufficient→비활성). ExploreScene(season Chip 5·explore 12카드·칩 클릭→입력 채움). LoadingScene('Reading the silhouette'+진행텍스트). ResultsScene(slide 3·nav ←→ index 변경·mini-action 3·View products→콜백). studio/page(초기 scene=explore, error 분기 존재).

## Acceptance
`npm run lint && build && test` 통과. /studio explore로 뜨고 dock·season칩·12카드·loading/results 마크업·mini-action 자리·error 분기 모두 존재. scene 토글·carousel은 useState/useReducer만, 외부 fetch 0.

## Anti-patterns
빈 입력창 첫화면 금지(큐레이션+칩). 상품 그리드 먼저 금지. 채팅창만 강조 금지. 풀 멀티턴 채팅 UI 금지(mini-action 3 자리만). 로딩 빈화면 금지. 토큰 변동/카운터 표시 금지. 클라에서 OpenAI/Supabase 직접 호출 0.
