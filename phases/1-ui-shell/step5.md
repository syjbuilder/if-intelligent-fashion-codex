# Step 5: overlays-auth-history-drawer

## Files To Read
step1~4 결과, `디자인/if-homepage-v0.7.html`(.auth-screen/.history-page/.drawer-bag), `docs/PRD.md`(인증·저장), `docs/ADR.md`(ADR-004/006/012/016).

## Task (TDD — 테스트 먼저)
- `src/components/studio/AuthOverlay.tsx`(Client): `.bg-slate-scene` + auth-card(eyebrow 'Sign in to IF' + headline 'Style your Imagination.' + sub) + **social-btn 3개 순서 Google(#fff)→Kakao(#FEE500)→Naver(#03C75A)** + fineprint. **버튼은 콜백 prop만 — OAuth/fetch 절대 0(시크릿 클라 번들 유입 차단).** open/onClose.
- `src/components/studio/HistoryOverlay.tsx`(Client): history-head(back/eyebrow 'Atelier'/title 'Saved Looks'). `isLoggedIn` prop:
  - true + 저장>0 → saved-grid(LookCard 재사용)
  - **true + 저장0 → 빈 상태('첫 룩을 저장해보세요' CTA, D8)**
  - false → history-gate(headline '...<span.accent>로그인</span>하세요' + gate Cta + blur gate-preview 3장)
- `src/components/studio/ProductDrawer.tsx`(Client): drawer-bag — 데스크톱 우측 슬라이드(translateX) / **모바일 바텀시트(translateY + grab handle ::before)**. panel-label + bag-title + product-list(products-fixtures mock + ₩가격) + panel-cta 'Buy Full Look'. **외부 구매 링크는 `aria-disabled`/disabled placeholder(자체 결제 0 — ADR-004, D7).** open/onClose.
- `src/app/studio/page.tsx`: 세 오버레이를 shell에서 토글(open/close + mock isLoggedIn). 외부 호출 0.
- `phases/1-ui-shell/index.json` 5 step → completed(+요약). `phases/index.json`에 `1-ui-shell` status 갱신.

## Tests-first 요점
AuthOverlay(소셜 3버튼 순서·라벨, fireEvent→콜백만·OAuth 호출 0 단언). HistoryOverlay(isLoggedIn·저장유무 3분기). ProductDrawer(open→보임, panel-cta·product-list+₩, 구매 aria-disabled, onClose). studio/page(overlay open 토글).

## Acceptance
`npm run lint && build && test` 통과(.next 정리 후). 세 오버레이 토글·정적 재현 완성. 전체 UI 셸(랜딩 풀 + 워크스페이스 정적)이 **외부 API 0**으로 빌드/렌더. index.json 갱신.

## Anti-patterns
OAuth secret/실 호출 0. 비로그인 history 빈 리스트 금지(gate 강제). 소셜 순서 Google→Kakao→Naver 고정. 구매 외부 링크 placeholder만(자체 결제 0). 토큰/플랜 결제 활성 UI 0. admin 화면 0. 모바일 drawer=바텀시트.
