# I.F 일상 작업 프로세스 (WORKFLOW)

> 사용자(비개발자 PM)가 한국어로 의도를 말하고, AI 에이전트가 git·파일·PR을 대신 실행하는 모델에서 **매일 어떻게 일하는지**를 박제한 문서.
> 새 세션·새 협업자·미래의 자신 모두 이거 한 페이지면 일상 사이클을 잡을 수 있다.
>
> 거버넌스 원칙은 [`docs/ADR.md`](./ADR.md) ADR-010(commander 모델)·ADR-011(문서 거버넌스), 문서 어디에 뭐 있는지는 [`docs/DOC_MAP.md`](./DOC_MAP.md).

## 누가 이걸 봐야 하나

- **사용자(매일)** — "지금 뭘 해야 하지?" 헷갈릴 때
- **새 세션의 AI 에이전트** — 첫 작업 진입 시 워크플로우 파악
- **미래 협업자** — 이 저장소 어떻게 굴러가는지 30분 안에 이해

## 한 줄 핵심

**수정 → `/sync-docs` → `/commit` → `/pr`**.
헷갈리면 [`docs/DOC_MAP.md`](./DOC_MAP.md). 막히면 §5 "자주 막히는 케이스".

---

## 도구 지도

### 자동 가드 (사용자 개입 0 — 시스템이 알아서)

| 가드 | 작동 시점 | 막는 사고 |
|---|---|---|
| `main-branch-guard.sh` | main에서 `git commit`/`git push` 시도 | main 직접 오염 |
| `secret-guard.sh` | Write/Edit 시 시크릿 패턴 감지 | `.env`/API key 유출 |
| `tdd-guard.sh` | `.ts/.tsx/.js/.jsx` 구현 파일 수정 | 테스트 누락 |
| `.githooks/sync-warn.sh` | `git commit` 직전 | docs↔한국어 짝꿍 미동기 |

### 슬래시 명령 (사용자가 호출 — 한 단어로 압축)

| 명령 | 언제 쓰나 | 빈도 |
|---|---|---|
| `/commit` | 작업 단위 1개 끝났을 때 | 하루 1~3회 |
| `/pr` | 작업 묶음 GitHub에 올릴 때 | 주 1~3회 |
| `/sync-docs` | `docs/` 또는 한국어 원본 수정 직후 | docs 변경마다 |
| `/brief` | 세션 끊을 때 (다음 세션 복붙용) | 세션 끝마다 |

### Harness (3 step 이상 작업)

3개 이상의 step·여러 모듈 동시 변경·자동 재시도 필요 시 `harness-framework` 스킬 호출 → `phases/{task}/index.json` + `step{N}.md` 설계 → `python scripts/execute.py <task>` 실행. 단순 변경엔 안 씀.

---

## 7개 일상 시나리오

### A. 제품 범위(PRD) 변경 — "V0에 음성 입력 검토 항목 추가"

1. [`docs/DOC_MAP.md`](./DOC_MAP.md) §2에서 PRD 짝꿍 확인 → `docs/PRD.md` ↔ `기획/I.F V0 PRD.md`
2. `docs/PRD.md` 또는 한국어 원본 중 익숙한 쪽 편집
3. `/sync-docs` → AI가 짝꿍에 반영 + diff 보여줌 → 승인
4. `/commit` → pre-commit sync-warn이 둘 다 staged 확인 → 통과
5. `/pr` → PR 작성

깜빡하고 한쪽만 staged? sync-warn이 "기획/I.F V0 PRD.md도 함께 sync하시겠습니까? (y/N)" 경고 → N으로 중단 → `/sync-docs` 다시.

### B. 디자인 시안 v0.7 신규 작성

1. DOC_MAP §3 archive 정책 확인 — v0.0~v0.6은 `디자인/archive/`, 현행은 v0.6
2. 새 시안: `디자인/if-homepage-v0.7.html` (디자인/ 루트에 신규)
3. v0.7이 새 기준선으로 확정되면:
   - `git mv 디자인/if-homepage-v0.6.html 디자인/archive/`
   - `docs/UI_GUIDE.md` "기준 시안" 라인 v0.6 → v0.7
   - `CLAUDE.md` "최신 디자인 시안" 라인 갱신
   - `디자인/I.F 디자인 계획 v0.0.md` archive에 v0.7 히스토리 추가
4. 폐기 시안이면 archive 보내지 말고 그냥 삭제 (ADR-011)

### C. 새 ADR 추가 — "ADR-012 이미지 캐싱 정책"

1. DOC_MAP §2에서 ADR 거울 확인 → `docs/ADR.md` ↔ `기획/I.F V0 PRD.md` + `기술/I.F V0 TRD.md`
2. `docs/ADR.md`에 ADR-012 블록 추가
3. `/sync-docs` → 한국어 원본 두 곳에 동시 반영
4. CRITICAL 규칙이 새로 생긴 ADR이면 `CLAUDE.md`에도 한 줄 추가
5. `/commit` → 경고 훅이 3파일 다 staged 확인 후 통과

### D. 학습/개인 자료 추가 — "Claude Skill 작성법 노트"

1. DOC_MAP §6 "제외" 확인 — `학습/`은 git 추적 안 함
2. `학습/claude_skill_작성법.md` 새 파일 생성
3. `git status`에 안 보임 (`.gitignore` 차단)
4. commit·PR 동작 없음 — OneDrive에 보존되는 개인 자료

**중요**: 팀 공유 필요하면 `docs/` 또는 `.claude/commands/`로 옮겨야 추적됨. `학습/`에 두면 영원히 untracked.

### E. API 스키마 변경 — "looks 테이블에 style_score 컬럼 추가"

DATA_MODEL + API_CONTRACTS 동시 영향, 둘 다 `기술/I.F V0 TRD.md` 거울.

1. DOC_MAP §2 확인 → `docs/DATA_MODEL.md` 15장, `docs/API_CONTRACTS.md` 16장 둘 다 TRD에 매핑
2. `docs/DATA_MODEL.md`·`docs/API_CONTRACTS.md` 둘 다 수정
3. `/sync-docs` → 한 번에 TRD 15장·16장 반영
4. 코드 변경(마이그레이션·API 핸들러)도 같이 staging → TDD 가드가 테스트 파일 검사
5. `/commit` → 4파일 정상 통과

### F. 한국어 폴더 단독 메모 — "기획/ 브레인스토밍"

1. `기획/brainstorm_2026-05-26.md` 같은 파일 추가
2. **거울 짝꿍이 없는 단독 문서** — sync-warn 발동 안 함
3. 그대로 `/commit` 가능
4. 향후 PRD에 흡수돼야 한다면 그때 `docs/PRD.md`로 옮기고 `/sync-docs`

### G. 새 협업자(미래 자신) 온보딩

1. [`README.md`](../README.md) → "문서 어디에 뭐 있는지" → [`docs/DOC_MAP.md`](./DOC_MAP.md) 링크
2. DOC_MAP 한 페이지로 전체 지형 파악
3. [`CLAUDE.md`](../CLAUDE.md)에서 CRITICAL 규칙·자동화 훅 확인
4. 이 문서(`docs/WORKFLOW.md`)로 일상 흐름 잡기
5. `.claude/commands/` 4개 슬래시 + `.claude/hooks/`·`.githooks/` 자동 가드 4종 확인

---

## 자주 막히는 케이스

### main 차단됐을 때

> "main에 직접 commit할 수 없습니다. 어떤 브랜치명으로 분기할까요?"

→ `"feat/디자인-v0.7 정도로 해줘"` 같이 답하면 AI가 `git checkout -b feat/디자인-v0.7` 자동 실행. 작업 계속.

### 시크릿 차단됐을 때

> "이 값은 시크릿 키로 보입니다."

→ `.env`에 옮기고 환경변수로 읽도록 부탁. `.env.example`에는 `OPENAI_API_KEY=your-key-here` 같이 placeholder만.

### TDD 가드 차단됐을 때

> "이 구현 파일에 대응 테스트가 없습니다."

→ 보통: 테스트 파일 먼저 작성. 프로토타이핑 단계라 일시 해제하고 싶다면 `.claude/settings.local.json.example`을 `.claude/settings.local.json`으로 복사 (gitignore됨, 개인 환경만 영향). 안정화되면 삭제.

### sync-warn 경고 떴을 때

> "[sync-warn] 문서 짝꿍 미동기 N건 감지"

세 가지 선택:
- (a) 실제로 sync 필요 → N 입력 → `/sync-docs` 실행 → 다시 commit
- (b) 짝꿍이 영향 안 받는 변경(예: ADR 본문 안 건드리고 매핑 데이터만 수정) → y로 통과
- (c) 새 거울 짝꿍을 만들고 싶다 → `.githooks/sync-pairs.tsv`와 DOC_MAP §2에 행 추가

### `/pr` 했는데 PR이 안 만들어짐 (`gh` 인증 없음)

→ Claude가 브라우저 URL 제공 (`https://github.com/<owner>/<repo>/pull/new/<branch>`) + 제목·본문 텍스트. 브라우저에서 복붙해서 생성.

---

## 헷갈리면 어디 보나

| 질문 | 답 있는 곳 |
|---|---|
| 어디에 뭐 문서가 있나 | [`docs/DOC_MAP.md`](./DOC_MAP.md) |
| 왜 이렇게 결정했나 | [`docs/ADR.md`](./ADR.md) (특히 ADR-010·011) |
| 무슨 제품인가, V0 범위 | [`docs/PRD.md`](./PRD.md) |
| AI는 어떤 규칙으로 일하나 | [`CLAUDE.md`](../CLAUDE.md) |
| 일상 작업은 어떻게 | **이 문서** (`docs/WORKFLOW.md`) |
| 자동 가드 4종 자세히 | `학습/Claude_훅_슬래시_가이드.md` (개인 노트) |
| 명령어 한 단어 | `.claude/commands/{commit,pr,sync-docs,brief}.md` |
