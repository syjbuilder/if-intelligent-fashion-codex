# Architecture Decision Records

> 출처: `기술/I.F V0 TRD.md` 21장 ADR Candidates. 본 문서는 harness 워크플로우가 기술 결정의
> 경계를 확인하기 위한 정식 기록이다. 새 결정은 ADR-NNN을 추가한다. 빈 `ADR/` 폴더는
> 향후 개별 ADR 파일 분리용으로 보존한다.

## 철학

MVP 속도 최우선. 외부 의존성 최소화. 한국 시장 로컬화 우선. 1인 창업자가 AI 에이전트와
함께 실행 가능한 범위로 제한하고, 작동하는 최소 구현을 선택한다.

---

### ADR-001: V0는 웹 기반 MVP로 시작하되 앱 전환 가능성을 고려한다
**결정**: Next.js 웹 MVP로 출시. 모바일 웹 핵심 플로우를 V0 검증 범위에 포함. 앱은 V0에서 만들지 않음.
**이유**: 개발 속도, 빠른 검증, Vercel+Supabase로 운영 부담 최소화. 국내 패션 소비는 모바일 중심.
**트레이드오프**: 네이티브 앱 경험 지연. 대신 API-first 구조로 React Native/Expo 전환 여지를 남김.

### ADR-002: V0는 Next.js + Supabase + Vercel 조합으로 시작한다
**결정**: Frontend는 Next.js(App Router, TypeScript), DB/Auth/Storage는 Supabase, 배포는 Vercel+Supabase.
**이유**: 단일 SDK로 Auth+Postgres+Storage 처리, 초기 무료 티어, RLS 보안, 1인 운영에 적합.
**트레이드오프**: vendor lock-in. 복잡한 쿼리/AI 로직은 이후 별도 서버가 필요해질 수 있음.

### ADR-003: AI 이미지는 OpenAI GPT Image 2를 우선 테스트하고 하이브리드 생성을 채택한다
**결정**: 이미지 생성 모델은 OpenAI GPT Image 2 우선 테스트(Nano Banana는 비교 후보). 데모/인기
프롬프트는 사전 생성·검수 룩, 자유 프롬프트는 실시간 생성하는 하이브리드 방식.
**이유**: 첫 경험 실패율·생성 비용 통제, 의류 표현 품질과 한국 패션 무드 반영 검증 필요.
**트레이드오프**: 모델 API 모델명·가격·조건은 구현 직전 공식 문서로 재확인 필요. 사전 검수 룩 운영 부담.

### ADR-004: V0에서는 자체 결제를 통한 상품 구매를 제공하지 않는다
**결정**: I.F는 자사몰이 아님. 상품 카드의 구매 버튼은 외부 쇼핑몰/브랜드 페이지로 이동. 결제는 V0 Extended.
**이유**: 물류·배송·환불·CS·PG 연동은 1인 MVP 범위 초과. 핵심 가치는 탐색·연결.
**트레이드오프**: 구매 전환을 직접 측정 불가 → V0 KPI는 구매 링크 클릭률로 대체.

### ADR-005: 추천 단위는 개별 상품보다 전체 룩 중심으로 한다
**결정**: V0의 핵심 데이터 단위는 개별 상품이 아니라 전체 룩. curated look DB 500개로 시작.
**이유**: 사용자는 "이 조합을 입고 싶다"는 감각으로 탐색. 룩 단위 사전 검수로 매칭 품질 통제.
**트레이드오프**: 초기 데이터 구축에 사람 손이 많이 듦. 자동 매칭은 후속 버전으로 미룸.

### ADR-006: 이미지 업로드·얼굴 합성·가상 피팅·셀럽 기반 생성은 V0에서 제외한다
**결정**: 사용자 이미지 업로드, 얼굴 합성, 가상 피팅, 셀럽/인플루언서 이미지 기반 생성은 V0 범위 밖.
**이유**: 저작권·초상권 등 법적 리스크, 별도 약관·정책·법무 검토 필요.
**트레이드오프**: 차별화 기능 일부 지연. V2 이후 별도 정책 수립 후 도입.

### ADR-007: FastAPI는 V0 Core에서 분리하지 않는다
**결정**: AI 프롬프트 해석·이미지 생성·상품 매칭은 초기에 Next.js 서버 영역에서 처리. AI 파이프라인
복잡도가 커질 때 FastAPI 별도 서버로 분리.
**이유**: 처음부터 분리하면 배포·운영 복잡도 상승. MVP 속도 우선.
**트레이드오프**: 나중에 분리 리팩터링 비용 발생. 대신 `src/services/`로 경계를 미리 정리.

### ADR-008: 상품 링크는 수동 입력/제휴/API 우선, 크롤링은 후순위로 둔다
**결정**: V0는 사람이 검수한 상품 링크로 시작. 전체 쇼핑몰 자동 크롤링은 V0 핵심 의존성에서 제외.
**이유**: 쇼핑몰별 약관 리스크, 가격·재고 변동, 크롤링 유지보수 비용이 1인 MVP 범위 초과.
**트레이드오프**: 초기 상품 커버리지 제한. V1에서 어필리에이트 API, V2에서 자동 수집 검토.

### ADR-009: V0는 싱글턴 워크스페이스 + mini-action 패턴 채택, 풀 멀티턴 채팅은 V1 검토
**결정**: 현재 v0.6 "Editorial AI Studio + Landing Long-form" 디자인을 V0 기준선으로 유지한다. 결과 정제는 다음 3개 mini-action으로 처리:
1. **다시 생성** — 결과 카드 위 버튼, 같은 의도로 룩 1-3개 재생성
2. **조건 좁히기 (정제 칩)** — 칩 클릭이 silent filter가 아니라 새 conversation turn으로 처리됨 (AI가 의도 보정 후 재검색·생성)
3. **More Like This** — 각 룩/상품 카드의 변주 3개 생성 버튼

추가로 Explore 진입 피드(큐레이션 룩 + 시즌 데모 프롬프트)를 도입해 "빈 입력창 마비"를 방지한다. Daydream식 풀 멀티턴 채팅 UI는 V0에서 도입하지 않는다.

**이유**:
- 해외 레퍼런스 Daydream(daydream.ing)은 멀티턴 채팅 + Pinterest 그리드 + Say More 정제 패턴인데, 분석 결과 핵심 가치(자연어 정제·취향 피벗)는 풀 채팅 없이도 mini-action으로 약 80% 흡수 가능
- 풀 채팅 도입 시: 인지 부담 증가(무한 대화 피로), 토큰 비용 증가(대화 컨텍스트 누적), V0 일정 한 달 이상 지연(디자인 처음부터), "Editorial AI Studio" 컨셉(작업실 메타포)과 충돌
- I.F.의 차별점은 AI 룩 이미지 생성(Daydream은 이 기능 없음). 풀 채팅 모방은 차별점 희석

**트레이드오프**:
- 깊은 대화형 취향 좁히기 부족 → mini-action 3개로 보완 (특히 More Like This가 취향 피벗 역할)
- 결과 누적 히스토리 관리 단순화 (Daydream의 "긴 대화 결과 경계 흐려짐" 약점 회피)
- V1에서 사용자 피드백·이탈 데이터를 본 뒤 풀 채팅 도입 여부 재검토. Explore 피드와 mini-action 데이터가 의사결정 기준.

**관련**: PRD §8.4 Mini-Action Pattern, §9.6 Explore Screen, §10.10 Mini-Actions

### ADR-010: 1인 비개발자 commander × AI 에이전트 협업 모델 — 자동 가드 4종 + Harness 워크플로우

**결정**: 사용자는 한국어 자연어로 의도만 전달하고, AI 에이전트(Claude·Codex)가 git·파일 편집·PR 생성을 대신 실행한다. 사고 위험은 PreToolUse·pre-commit 훅 4종이 사전 차단한다:

1. `.claude/hooks/main-branch-guard.sh` — main에서 `git commit`/`git push` 시도 시 Bash 도구 호출 차단
2. `.claude/hooks/secret-guard.sh` — `.env`/API key/JWT/AWS key/GitHub token/Stripe key/DB URL 패턴이 들어가는 Write/Edit 차단
3. `.claude/hooks/tdd-guard.sh` — `.ts/.tsx/.js/.jsx` 구현 파일에 대응 테스트가 없으면 Write/Edit 차단
4. `.githooks/sync-warn.sh` — pre-commit 시 `.githooks/sync-pairs.tsv`의 docs↔한국어 짝꿍 중 한쪽만 staged면 경고 + y/N 프롬프트 (인터랙티브 환경에서만 block, CI 등 non-interactive에서는 경고만)

3 step 이상의 복합 작업(여러 모듈 동시 변경·자동 재시도 필요)은 Harness 워크플로우(`phases/{task}/index.json`, `step{N}.md`, `scripts/execute.py`)로 단계 분해해 실행. 단순 변경은 phase 없이 직접 진행.

**이유**: 사용자는 비개발자라 직접 git/터미널을 치지 않는 워크플로우가 전제. 그러나 "AI가 다 알아서" 모델은 시크릿 유출·main 오염·테스트 누락·문서 drift 같은 사고 위험을 키운다. 가드 4종이 사용자/에이전트를 가리지 않고 같은 라인에서 막아주므로, 사용자는 "커밋해줘"라고만 부탁하면 됨. Harness는 멀티 step 작업에서 컨텍스트 유실·중복 작업·복구 비용을 줄임.

**트레이드오프**:
- 가드 false-positive 시 일일이 해제 부담 → `xxx`·placeholder·"example"·"TODO" 등 힌트 단어 예외 패턴으로 최소화
- Harness는 단순 변경엔 과한 절차 → "3 step 이상·여러 모듈·재시도 필요" 기준으로 사용 진입선 둠
- TDD 가드는 초기 프로토타이핑 단계에서 답답함 → `.claude/settings.local.json.example` 복사로 일시 비활성 가능 (gitignore됨)

**관련**: CLAUDE.md "아키텍처 규칙"·"개발 프로세스" CRITICAL, `.claude/hooks/`, `.githooks/`, `.claude/skills/harness-framework/`, `학습/Claude_훅_슬래시_가이드.md`.

### ADR-011: 문서 거버넌스 — docs/ 영문 정본 + 한국어 원본 이중 유지 + DOC_MAP 단일 지도 + UI_GUIDE 단일 운영 스펙

**결정**:
- `docs/` 7개(`PRD`, `ARCHITECTURE`, `ADR`, `UI_GUIDE`, `DATA_MODEL`, `API_CONTRACTS`, `AI_PIPELINE`)를 공식 single source of truth로 둔다.
- 한국어 원본(`기획/I.F V0 PRD.md`, `기술/I.F V0 TRD.md`, `기획/If discovery summary.md`)은 보관소로 함께 유지한다.
- 모든 문서의 신원(정본/거울/archive/운영자산/제외)과 sync 짝꿍은 [`docs/DOC_MAP.md`](./DOC_MAP.md) 한 페이지에 명시한다.
- docs↔한국어 짝꿍 매핑은 `.githooks/sync-pairs.tsv`에 데이터로 두고 `sync-warn.sh`(ADR-010 §4)가 drift를 자동 감지한다.
- 디자인은 `docs/UI_GUIDE.md`가 단일 운영 디자인 스펙이며, `디자인/I.F 디자인 계획 v0.0.md`는 archive(버전 히스토리·의사결정 기록)로 역할 분리한다. 이중 업데이트 금지.
- 폐기된 시안 버전은 archive로 보내지 않고 삭제, 이전 버전 시안 HTML은 `디자인/archive/`로 분리한다.

**이유**: 한국어로 사고하는 1인 PM의 작성 속도와 영문 docs로 일하는 AI 에이전트·미래 협업자의 검색 속도를 둘 다 살리는 절충안. 둘 중 하나를 버리면 한쪽 비용이 커짐. UI_GUIDE/디자인계획 분리는 ADR-009 v0.6 기준선 확정 과정에서 "운영 값과 의사결정 기록의 이중 업데이트 부담"이 누적된 결과 — archive는 히스토리만, 운영 값은 한 곳에만.

**트레이드오프**:
- 동일 결정을 두 언어로 유지하는 비용 → `/sync-docs` 슬래시 + `sync-warn.sh` 자동 경고로 사람 책임 0에 수렴
- DOC_MAP을 항상 최신 유지해야 함 → CLAUDE.md CRITICAL로 "문서 추가·이동·삭제 시 DOC_MAP 같이 갱신" 박제
- UI_GUIDE 단일화로 디자인 의사결정 archive 가치가 디자인계획 v0.0.md에 격리 → 이 파일을 "디자인 archive 정본"으로 명시

**관련**: `docs/DOC_MAP.md`, `.githooks/sync-pairs.tsv`, `.githooks/sync-warn.sh`, `.claude/commands/sync-docs.md`, ADR-010(가드 일부로 sync-warn 포함), ADR-009(디자인 v0.6 기준선).

### ADR-012: 토큰 차감 정책 — 1회 검색 = 10토큰 일률, free/Pro/Max 3-tier

**결정**:
- **토큰 단위 정의**: **1회 검색 = 10토큰 = 룩 3개** (OpenAI image generation API 3회). 검색 단위 일률 차감. `max_looks` 사용자 노출 파라미터 없음, 서버는 항상 3개 반환.
- **차감 매트릭스 (모든 generation 액션 동일 10토큰)**:

| 액션 | 차감량 | `token_transactions.reason` |
|---|---|---|
| fresh / regenerate / chip_refine | 10토큰 | `generation` |
| MLT (More Like This) | 10토큰 | `more_like_this` |
| demo seed → generate | 10토큰 | `demo_prompt` |
| save / view explore·look·products / share | 0토큰 | 차감 없음 |

- **결제 모델 (2-tier + 가입 grant, topup 미도입)**:

| 플랜 | 가격 | 그랜트 | 검색/월 | 갱신 | Saved | Quality | V0 단계 |
|---|---|---|---|---|---|---|---|
| free | 0원 | 가입 1회 10토큰 | 1회 | 없음 | 5개 슬롯 | Medium | V0 Core |
| Pro | 9,900원/월 | 월 100토큰 | 10회 | 매월 1일 cron + 익월 expire | 5개 슬롯 | Medium | V0 Extended |
| Max | 19,900원/월 | 월 200토큰 | 20회 | 매월 1일 cron + 익월 expire | 무제한 | Medium | V0 Extended |

- **이미지 quality**: 모든 tier OpenAI GPT Image 2 Medium 고정 (1024×1024, $0.053 = 약 74원/이미지).
- **B-path 무료 정책 폐기**: 검색 단위 일률 차감 단순성을 우선. curated DB는 마진 기여로만 활용, UI 노출 없음.
- **topup (단발 충전)**: V0.5+ 후순위 검토 (Leonardo·Botika 모델 참고, 사용량 데이터 6개월 후 결정).
- **재검토 트리거**: 환율 1USD ≥ 1,700원 또는 OpenAI 단가 인상 ≥ 20% 시 ADR-012 갱신 필수.

**이유**:
- **운영 원가 안전**: Medium 74원/이미지 × 3 = 222원/검색. Pro 100토큰 최악(월 10회 풀 소진) cost 2,220원, 마진 7,680원(77%). Max 200토큰 최악 cost 4,440원, 마진 15,460원(78%). SaaS 표준(70-80%) 안전 확보 — B-path 무료 정책 없어도 흑자.
- **시장 가격 적합**: 9,900원은 한국 SaaS 황금 포인트(밀리의 서재·T우주패스). 19,900원은 Netflix Korea 기본형 동심리대. 경쟁 패션 AI Botika $22≈31,000원 대비 3분의 1 가격으로 압도적 포지셔닝.
- **사용자 인지 단순성**: "1회 검색=10토큰=룩 3개" 일률화로 토큰 계산 부담 없음. UI에 "이번은 무료" / "MLT는 0.5토큰" 같은 변동 표시 없음. ADR-009 mini-action 단순성 원칙과 동조.
- **GPT Image 2 한국 패션 적합성**: 한글 텍스트 정확도 99%+, 동양인 인물·한국 무드 표현 Midjourney 대비 우위. ADR-003 모델 선정 근거 강화.

**트레이드오프**:
- B-path 적중 시에도 10토큰 차감 → curated DB 차별점이 사용자 가치로 노출되지 않음. 단순성 vs 차별점 노출 사이에서 단순성 선택. V1에서 "curated 적중률 표시" 재검토 가능.
- free 10토큰은 1회 검색만 가능 → "체험판" 성격, 빠른 conversion 압박. 단 V0 검증 단계엔 conversion funnel 데이터 수집에 유리.
- topup 미도입으로 헤비 유저는 Max로만 흡수 → 결제·환불·세금계산서 등 운영 부담 최소화.
- OpenAI 단가/환율 변동 영향 직접 노출 → 재검토 트리거 명시로 hedge.

**관련 docs 변경 (ADR-012 머지 시 함께)**:

`docs/API_CONTRACTS.md` 5개 변경:
1. §공통 규칙에 토큰 단위 정의 박제 (1회 검색=10토큰=룩 3개)
2. §3 `/api/looks/generate` 응답 `tokens_spent: 10` 고정
3. §3 request에서 `max_looks` 파라미터 제거 (서버는 항상 3 반환)
4. §7 `/api/looks/:id/more-like-this` 응답 `tokens_spent: 10`
5. `pipeline_source` 필드는 telemetry용으로만 유지, 사용자 노출 X

`docs/DATA_MODEL.md` 4개 변경:
1. `plans` 시드에 `'max'` row 신규 추가
2. free `monthly_token_grant` 3 → 10
3. Pro `max_saved_looks` null → 5
4. `plans.monthly_token_grant`·`token_transactions.amount` 주석에 "의미는 ADR-012 참조" 명시

**소진 후 UX**:
- free 소진: "체험을 마쳤습니다. Pro/Max 출시 시 알림" wait list 모달
- Pro/Max 소진: "이번 달 토큰 소진. 다음 달 1일 자동 충전 또는 Max 업그레이드"
- V0 Core 단계엔 wait list만, V0 Extended에서 결제 활성

**향후 검토 (별도 ADR 후보)**:
- V0.5+ topup 도입 결정 (사용량 데이터 6개월 후)
- Max tier 차별화 확장 (priority queue, 고급 필터 등)
- OpenAI Tier 2 (분당 20 IPM) 진입 시점 — $100 누적, V0 출시 후 자연 도달

**관련**: `docs/PRD.md` §8(토큰·구독), `docs/API_CONTRACTS.md` §공통 규칙·§3·§7, `docs/DATA_MODEL.md` §15.8(token_transactions)·§15.9(plans), `docs/AI_PIPELINE.md`(B-path/A-path 모델), ADR-003(OpenAI 모델 선정), ADR-009(mini-action 차감 트리거 행위).
