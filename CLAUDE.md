# 프로젝트: I.F (Intelligent Fashion)

사용자가 텍스트 프롬프트로 상상한 패션 스타일을 AI 룩 이미지로 시각화하고, 실제 구매 가능한
국내 패션 상품으로 연결하는 AI 패션 탐색 서비스. 한국 20-30대 여성 데일리 패션 타겟.
핵심 흐름: 프롬프트 입력 → AI 룩 이미지 1-3개 생성 → 룩별 상품 패널 연결 → 저장·공유.

브랜드 메시지: "Wear what you imagine." — I.F는 자사몰이 아니라, 여러 온라인몰을 가로지르는
독립형 AI 탐색 레이어다.

## 기술 스택

- Next.js (App Router) + TypeScript — React Server Components 기본, API Route/Server Actions 통합
- Supabase — PostgreSQL + Auth + Storage
- Vercel 배포 (Web), Supabase (DB/Auth/Storage)
- AI: OpenAI GPT Image 2 우선 테스트 (이미지 생성, Nano Banana는 비교 후보) / 프롬프트 해석은 LLM + JSON schema + 한국어 패션 taxonomy
- 스타일링: Tailwind CSS + Playfair Display(헤드라인) + Manrope(본문)
- FastAPI는 V0 Core에서 분리하지 않는다. AI 파이프라인 복잡도가 커지면 그때 도입.

## 아키텍처 규칙

- CRITICAL: 시크릿(`.env`, API key, OAuth secret, 결제 secret, DB 접속 정보)은 절대 커밋하지 않는다. 프로덕션 DB에 직접 쿼리하지 않으며, 데이터 변경·조회 테스트는 local 또는 staging에서 먼저 검증한다.
- CRITICAL: `main` 브랜치에 직접 push하지 않는다. 모든 변경은 별도 브랜치에서 작업하고 PR로 검토 후 merge한다.
- CRITICAL: 핵심 기능(로그인, 프롬프트 처리, AI 룩 생성, 상품 추천, 저장, 토큰 차감)은 API-first로 설계하고 특정 웹 화면에 종속시키지 않는다. 외부 API(OpenAI, Supabase)는 `src/app/api/` 라우트 핸들러 또는 서버 영역에서만 호출한다 — 클라이언트 컴포넌트에서 직접 호출 금지(API 키 노출 방지).
- CRITICAL: V0 범위 밖 기능은 구현하지 않는다 — 사용자 이미지 업로드, 얼굴 합성, 가상 피팅, 셀럽/인플루언서 이미지 기반 생성, 자체 결제 기반 구매, 전체 쇼핑몰 자동 크롤링. (`docs/PRD.md` Non-Goals, `docs/ADR.md` ADR-004/006 참조)
- CRITICAL: AI 룩 이미지는 한국 20-30대 여성 데일리 패션, 전체 착장 가시성(상의/하의 또는 원피스/아우터), 국내 온라인몰 상품 매칭 가능성을 품질 기준으로 한다. 상반신 클로즈업·하의 잘림·런웨이/코스튬 결과는 실패로 본다.
- 컴포넌트는 `src/components/`, 타입은 `src/types/`, 외부 API 래퍼는 `src/services/`, 유틸·클라이언트는 `src/lib/`로 분리한다. 향후 `apps/`+`packages/` 모노레포 분리 가능성을 막지 않는다 (`docs/ARCHITECTURE.md` 참조).
- 디자인 원칙: "AI는 조용하게, 룩은 감각적으로, 상품은 명확하게." UI는 `docs/UI_GUIDE.md`의 AI 슬롭 안티패턴을 위반하지 않는다.

## 개발 프로세스

- CRITICAL: 새 기능 구현 시 반드시 테스트를 먼저 작성하고, 테스트가 통과하는 구현을 작성한다 (TDD). `.claude/hooks/tdd-guard.sh`가 PreToolUse 단계에서 자동 강제 — `.ts/.tsx/.js/.jsx` 구현 파일에 대응 테스트가 없으면 Edit/Write가 차단된다.
- 초기 프로토타이핑 단계에서 TDD 가드를 일시 비활성화하려면 `.claude/settings.local.json.example`을 `.claude/settings.local.json`으로 복사한다 (빈 hooks 객체로 덮어씀, gitignore됨). 코드베이스가 안정되면 삭제해 다시 켠다.
- 커밋 전 `npm run lint && npm run build && npm run test`가 통과해야 한다. `.githooks/pre-commit`이 자동 실행하며, 활성화는 `git config core.hooksPath .githooks` 1회 실행이 필요하다.
- 커밋 메시지는 conventional commits 형식: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `test:`.

## 문서 참조 우선순위

**원칙:** `docs/`가 공식 기준(single source of truth). 한글 폴더(`기획/`, `기술/`, `디자인/`, `문서_모두의 창업/`)는 원본 보관소이며 `docs/`로 부족할 때만 참조한다. 저장소 전반 안내는 [`README.md`](./README.md).

- 운영 가이드 (매 작업 시): `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/ADR.md`, `docs/UI_GUIDE.md`
- 상세 원본 (필요 시): `기획/I.F V0 PRD.md`, `기술/I.F V0 TRD.md`, `디자인/I.F 디자인 계획 v0.0.md`
- 최신 디자인 시안: `디자인/if-homepage-v0.4.1.html`
- 개발 착수 준비 현황: `개발_전_진행_체크리스트.md`

## 명령어

```
npm run dev      # 개발 서버 (localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint
npm run test     # 테스트
```

(아직 `package.json`이 없다. 위 명령어는 프로젝트 부트스트랩 phase에서 정의된다.)

## 자동화 진입점 (Harness 워크플로우)

- 새 작업 설계: `harness-framework` 스킬 호출 → phase 설계 → `phases/{task}/step{N}.md` 생성
- 자동 실행: `python scripts/execute.py <phase-name>` (예: `python scripts/execute.py 0-bootstrap`)
- 변경 리뷰: `harness-review` 스킬 호출
- phase 워크플로우는 다음 경우에 사용한다: ① 3 step 이상 ② 여러 모듈 동시 변경 ③ 자동 재시도가 필요한 작업. 단순 변경은 phase 없이 직접 작업해도 된다.

## 유지보수 노트

CLAUDE.md는 살아있는 문서다. 새 ADR 추가, MVP 범위 변경, 새 CRITICAL 규칙 발견, 명령어 추가 시 갱신한다.
