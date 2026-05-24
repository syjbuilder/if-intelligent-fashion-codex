---
description: 현재 변경사항을 conventional commits 형식으로 분석·검토·커밋
---

I.F 프로젝트의 변경사항을 커밋하는 작업입니다. 사용자는 비개발자이므로 모든 단계를 한국어로 진행하고, 메시지 후보는 반드시 사용자 승인 받은 뒤 커밋하세요.

## 절차

1. **상태 확인** (병렬 실행):
   - `git status` — untracked + staged + unstaged 확인 (`-uall` 금지: 큰 저장소에서 메모리 이슈)
   - `git diff` — staged + unstaged 전체 변경
   - `git log --oneline -10` — 최근 커밋 메시지 스타일 확인
   - `git branch --show-current` — 현재 브랜치 확인

2. **변경 성격 분석**:
   - 타입: 새 기능(feat) / 버그 수정(fix) / 문서(docs) / 리팩토링(refactor) / 잡일(chore) / 테스트(test) / 스타일(style)
   - 스코프 추출 — 예: `design`, `prd`, `adr`, `hooks`, `commands`, `homepage`
   - "왜" 1-2문장 (what이 아님 — what은 diff가 이미 보여줌)

3. **docs/ sync 사전 체크**:
   - `docs/PRD.md`, `docs/ADR.md`, `docs/ARCHITECTURE.md` 등 영문 docs/만 바뀌고 대응되는 한글 폴더(`기획/`·`기술/`·`디자인/`)가 그대로면 사용자에게:
     > "영문 docs/만 바뀌었습니다. `/sync-docs`를 먼저 실행할까요? (또는 이번엔 영문만 커밋할까요?)"
   - 사용자 결정에 따라 진행

4. **시크릿 사전 점검**:
   - staged diff에 명백한 시크릿 패턴(`sk-...`, `eyJ...`, `OPENAI_API_KEY=실제값`)이 있으면 즉시 중단하고 사용자에게 알림
   - secret-guard 훅이 1차로 막지만, 이미 staged된 변경에 들어가 있을 가능성을 한 번 더 체크

5. **커밋 메시지 작성**:
   - 형식: `<type>(<scope>): <한국어 또는 영문 요약>`
   - 예: `feat(design): apply v0.5 homepage shoot for narrative consistency`
   - 예: `docs(adr): add ADR-010 for hybrid look generation pipeline`
   - 본문(선택, 큰 변경에만): 왜 이 변경이 필요한지

6. **사용자 승인**:
   - 메시지 후보를 보여주고 "이대로 커밋할까요?" 명시적 승인 요청
   - 수정 요청 있으면 반영 후 다시 보여줌

7. **커밋 실행**:
   - **관련 파일만 명시적으로 stage**: `git add <file1> <file2>` — `git add -A` / `git add .` 절대 금지 (`.env` 같은 민감 파일 우발 포함 방지)
   - HEREDOC으로 커밋:
     ```bash
     git commit -m "$(cat <<'EOF'
     <type>(<scope>): <요약>

     <본문 — 선택>

     Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
     EOF
     )"
     ```
   - `--no-verify` / `--no-gpg-sign` 절대 금지. pre-commit 훅 실패 시 원인 수정 후 NEW 커밋 (`--amend` 금지 — 훅 실패면 커밋 자체가 안 일어났으므로 --amend는 직전 커밋을 건드림)

8. **결과 확인 및 보고**:
   - `git status`로 커밋 성공 + 남은 변경 확인
   - 사용자에게 한국어로 결과 보고: 어떤 메시지로 커밋됐는지, 다음에 `/pr`을 만들어야 하는지

## 주의

- **main 브랜치 차단**: main에서 실행되면 `main-branch-guard` 훅이 차단함. 차단 메시지를 받으면 사용자에게 "지금 main입니다. 어떤 브랜치명으로 분기할까요? (예: `feat/홈페이지-v0.5`)"라고 묻고, 답 받으면 `git checkout -b <branch>` 실행 후 다시 커밋
- **변경 없음**: 변경이 없으면 빈 커밋 만들지 말고 "변경사항이 없어 커밋할 게 없습니다"라고 보고하고 종료
- **CLAUDE.md 갱신**: 새 CRITICAL 규칙·명령어·ADR가 추가되었다면 사용자에게 CLAUDE.md 갱신도 함께 필요한지 확인
