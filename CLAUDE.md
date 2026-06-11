# 프로젝트: I.F (Intelligent Fashion)

사용자가 텍스트 프롬프트로 상상한 패션 스타일을 AI 룩 이미지로 시각화하고, 실제 구매 가능한
국내 패션 상품으로 연결하는 AI 패션 탐색 서비스. 한국 20-30대 여성 데일리 패션 타겟.
핵심 흐름: 프롬프트 입력 → AI 룩 이미지 1-3개 생성 → 룩별 상품 패널 연결 → 저장·공유.

브랜드 메시지: "Wear what you imagine." — I.F는 자사몰이 아니라, 여러 온라인몰을 가로지르는
독립형 AI 탐색 레이어다.

## ⚠️ 작업 위치 (PO 머신 환경 — 매 세션 먼저 확인)

- **정본 작업 폴더 = `C:\dev\if`** (OneDrive 밖 · 한글경로 없음 → 빌드/커밋 안정). **모든 작업은 여기서 한다.** 지금 이 파일을 읽고 있다면 올바른 위치다.
- `C:\Users\sjs18\OneDrive\Desktop\IF\코덱스` = **stale 백업. 작업 금지.** OneDrive 동기화가 `.next` 빌드를 깨뜨려(EINVAL readlink) 2026-06-10에 repo를 옮겼다. 그 폴더에서 작업하면 낡은 베이스 위에 쌓이고 정본에 반영되지 않는다.
- GitHub 원격(`syjbuilder/if-intelligent-fashion-codex`)이 단일 진실원(SSOT). 두 로컬 폴더는 그 복제본일 뿐 — 폴더 하나가 사라져도 유실 없음.
- 새 세션은 반드시 `C:\dev\if`에서 열 것. 실수로 OneDrive 폴더에서 열렸다면 즉시 PO에게 알리고 `C:\dev\if`로 전환한다.

## 기술 스택

- Next.js (App Router) + TypeScript — React Server Components 기본, API Route/Server Actions 통합
- Supabase — PostgreSQL + Auth + Storage
- Vercel 배포 (Web), Supabase (DB/Auth/Storage)
- AI: OpenAI GPT Image 2 · Medium · 1024×1024 운영 고정 (이미지 생성, $0.053≈74원/이미지, GPT Image 1.5는 비용 후보 — `docs/ADR.md` ADR-003·ADR-012) / 프롬프트 해석은 LLM + JSON schema + 한국어 패션 taxonomy
- 스타일링: Tailwind CSS + Inter(영문·숫자, next/font) + Pretendard(한글, layout `<link>`) 단일 산세리프 — 헤드라인=본문 동일 매핑, weight 400/600/800만. (Playfair Display+Manrope는 v0.7 시안에서 폐기 — `docs/UI_GUIDE.md` 7원칙 §5. v0.8부터 디자인 기준선은 구현 코드+UI_GUIDE — 아래 문서 참조 우선순위 참조.) Phase 1 `1-ui-shell`에서 적용.
- FastAPI는 V0 Core에서 분리하지 않는다. AI 파이프라인 복잡도가 커지면 그때 도입.

## 아키텍처 규칙

- CRITICAL: 시크릿(`.env`, API key, OAuth secret, 결제 secret, DB 접속 정보)은 절대 커밋하지 않는다. 프로덕션 DB에 직접 쿼리하지 않으며, 데이터 변경·조회 테스트는 local 또는 staging에서 먼저 검증한다.
- CRITICAL: `main` 브랜치에 직접 push하지 않는다. 모든 변경은 별도 브랜치에서 작업하고 PR로 검토 후 merge한다.
- CRITICAL: 핵심 기능(로그인, 프롬프트 처리, AI 룩 생성, 상품 추천, 저장, 토큰 차감)은 API-first로 설계하고 특정 웹 화면에 종속시키지 않는다. 외부 API(OpenAI, Supabase)는 `src/app/api/` 라우트 핸들러 또는 서버 영역에서만 호출한다 — 클라이언트 컴포넌트에서 직접 호출 금지(API 키 노출 방지).
- CRITICAL: V0 범위 밖 기능은 구현하지 않는다 — 사용자 이미지 업로드, 얼굴 합성, 가상 피팅, 셀럽/인플루언서 이미지 기반 생성, 자체 결제 기반 구매, 전체 쇼핑몰 자동 크롤링. (`docs/PRD.md` Non-Goals, `docs/ADR.md` ADR-004/006 참조)
- CRITICAL: AI 룩 이미지는 한국 20-30대 여성 데일리 패션, 전체 착장 가시성(상의/하의 또는 원피스/아우터), 국내 온라인몰 상품 매칭 가능성을 품질 기준으로 한다. 상반신 클로즈업·하의 잘림·런웨이/코스튬 결과는 실패로 본다.
- CRITICAL: AI 룩 생성 결과 정제는 mini-action 3개 패턴으로만 처리한다 — (1) 다시 생성 (2) 정제 칩 = 새 conversation turn (3) More Like This. 풀 멀티턴 채팅 UI는 V0에서 도입하지 않으며, 도입 검토는 V1 사용자 피드백 데이터 분석 후. (`docs/ADR.md` ADR-009 참조)
- CRITICAL: AI 룩 생성 파이프라인은 curated look DB 검색(B-path, 약 90%) 우선 + AI 실시간 생성(A-path, fallback) 하이브리드. 데이터 자산(상품 태그·캡션·역프롬프트·멀티모달 임베딩·피드백)이 모델 파인튜닝보다 먼저. (`docs/AI_PIPELINE.md` 참조)
- 컴포넌트는 `src/components/`, 타입은 `src/types/`, 외부 API 래퍼는 `src/services/`, 유틸·클라이언트는 `src/lib/`로 분리한다. 향후 `apps/`+`packages/` 모노레포 분리 가능성을 막지 않는다 (`docs/ARCHITECTURE.md` 참조).
- 디자인 원칙: "AI는 조용하게, 룩은 감각적으로, 상품은 명확하게." UI는 `docs/UI_GUIDE.md`의 AI 슬롭 안티패턴을 위반하지 않는다.

## 개발 프로세스

- CRITICAL: 새 기능 구현 시 반드시 테스트를 먼저 작성하고, 테스트가 통과하는 구현을 작성한다 (TDD). `.claude/hooks/tdd-guard.sh`가 PreToolUse 단계에서 자동 강제 — `.ts/.tsx/.js/.jsx` 구현 파일에 대응 테스트가 없으면 Edit/Write가 차단된다.
- 초기 프로토타이핑 단계에서 TDD 가드를 일시 비활성화하려면 `.claude/settings.local.json.example`을 `.claude/settings.local.json`으로 복사한다 (빈 hooks 객체로 덮어씀, gitignore됨). 코드베이스가 안정되면 삭제해 다시 켠다.
- 커밋 전 `npm run lint && npm run build && npm run test`가 통과해야 한다. `.githooks/pre-commit`이 자동 실행하며, 활성화는 `git config core.hooksPath .githooks` 1회 실행이 필요하다.
- 커밋 메시지는 conventional commits 형식: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `test:`.

## 문서 참조 우선순위

- CRITICAL: 문서 거버넌스 단일 출처는 [`docs/DOC_MAP.md`](./docs/DOC_MAP.md) — 정본/거울/archive/운영 자산/제외 분류와 sync 짝꿍 매핑이 모두 거기 있다. 문서 추가·이동·삭제 시 DOC_MAP을 같이 갱신한다.
- 매 작업 시 최소: `docs/PRD.md`, `docs/ARCHITECTURE.md`, `docs/ADR.md`, `docs/UI_GUIDE.md`.
- 데이터·API·AI 설계: `docs/DATA_MODEL.md`, `docs/API_CONTRACTS.md`, `docs/AI_PIPELINE.md`.
- 디자인 기준선: **구현 코드(`src/`) + `docs/UI_GUIDE.md`** (2026-06 v0.8 디자인 보강 패스부터 — ADR-018, UI_GUIDE 머리말 참조). 시안 `디자인/if-homepage-v0.7.html`은 v0.7.3에서 동결된 참고 자료이며 더 이상 기준선이 아니다. 이전 시안(v0.0~v0.6)은 `디자인/archive/`.
- 한글 원본은 `기획/`, `기술/`에 그대로 보관. `docs/` ↔ 한글 원본 sync는 `/sync-docs` + pre-commit `sync-warn.sh` 경고로 관리한다 (DOC_MAP §2 거울 표 + `.githooks/sync-pairs.tsv` 참조).
- 일상 작업 프로세스·시나리오·막히는 케이스 대처는 [`docs/WORKFLOW.md`](./docs/WORKFLOW.md).
- 개발 착수 준비 현황: `개발_전_진행_체크리스트.md`.

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
