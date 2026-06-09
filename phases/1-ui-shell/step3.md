# Step 3: landing-page (/)

## Files To Read
step1·2 결과, `디자인/if-homepage-v0.7.html`(landing topbar/hero/how-it-works/curated-preview/footer/약관 모달), `docs/UI_GUIDE.md`.

## Task (TDD — 각 컴포넌트 테스트 먼저)
- `src/components/landing/Topbar.tsx`(Client): fixed, **mix-blend-difference**, grid 1fr auto 1fr [☰ Menu / BrandMark / Login]. **Menu 버튼은 no-op/숨김(menu-tray 안 만듦, D6)**. Login onClick prop. **`.landing` 바깥 형제로 배치**(stacking — 래퍼에 transform/z-index 금지).
- `src/components/landing/Hero.tsx`(Client): kicker + h1 'Style your Imagination.'(reveal-words) + Cta accent 'Get Started'(라우팅 placeholder) + scroll-hint. `.bg-hero-dark` + hero-lookbook 글래스 패널.
- `src/components/landing/HowItWorks.tsx`(Client): eyebrow + headline 'From <span.accent>intention</span> to wearable.'(reveal-words, **accent 워드 1회**) + sub + **`ol.steps` 3개**(step-num 01/02/03 accent / step-body / step-art SVG). **카드 그리드 금지**(풀폭 단일 컬럼).
- `src/components/landing/CuratedPreview.tsx`(Client): eyebrow "Today's curated" + headline 'Six directions to begin.' + curated-grid(repeat(3,1fr)) LookCard 6(fixtures) + Cta-dark 'Start the studio'.
- `src/components/landing/SiteFooter.tsx`(Client): ink 배경, footer-brand + footer-links(이용약관·개인정보 모달 트리거 콜백 / 문의 mailto) + **footer-affiliate 고지(무신사·29CM·지그재그·에이블리·네이버쇼핑 수수료)** + copy. 3줄+ 본문 좌측 정렬.
- `src/app/page.tsx`(Client shell): Topbar(밖) + main[Hero, HowItWorks, CuratedPreview] + SiteFooter + 약관 모달 open useState(트리거+placeholder 카드 셸, D5). 외부 호출 0.
- `src/app/__tests__/smoke.test.tsx`: 'Style your Imagination.' + footer 어필리에이트 고지 단언.

## accent ≤2 라이트 가드 (D11)
랜딩 라우트 1개 기준 `.accent`(워드강조 클래스, step-num은 별도 클래스 `.step-num`로 구분) 요소가 ≤2개임을 querySelectorAll로 단언하는 테스트 추가.

## Acceptance
`npm run lint && build && test` 통과(.next 정리 후). / 가 hero→how-it-works→curated-preview→footer 순 렌더, 어필리에이트 노출, accent 워드강조 ≤2.

## Anti-patterns
How it works 카드 그리드 금지(ol.steps). italic/<em> 0. Topbar mix-blend stacking 유지(래퍼 transform 금지). Get Started/Start the studio는 placeholder(외부 호출 0). 약관 본문 풀텍스트는 셸 제외.
