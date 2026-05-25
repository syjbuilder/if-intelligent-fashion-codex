---
description: 현재 브랜치를 GitHub PR로 생성 (필요 시 분기·push 자동)
---

I.F 프로젝트에서 GitHub PR을 생성하는 작업입니다. 사용자는 비개발자이므로 모든 단계를 한국어로 진행하고, PR title/body는 반드시 승인 받은 후 생성하세요.

## 절차

1. **상태 확인** (병렬 실행):
   - `git status` — 미커밋 변경 확인
   - `git branch --show-current` — 현재 브랜치
   - `git log --oneline main..HEAD` — main 대비 커밋 목록
   - `git diff main...HEAD --stat` — main 대비 변경 파일 요약
   - `git diff main...HEAD` — main 대비 전체 diff (긴 경우 stat만)

2. **사전 체크**:
   - 미커밋 변경이 있으면: "미커밋 변경이 있습니다. 먼저 `/commit`을 실행할까요?" 사용자 확인
   - **현재 브랜치가 main이면**: "main에서 PR을 만들 수 없습니다. 어떤 브랜치명으로 분기할까요? (예: `feat/디자인-v0.6`, `docs/sync`, `fix/홈페이지-여백`)" 질문 → 답 받으면 `git checkout -b <branch>` 실행. 이후 커밋이 main에만 있고 새 브랜치엔 없을 수 있는데, 새 브랜치 = 현재 main HEAD에서 분기되므로 OK
   - main과 비교한 커밋이 0개면: "main과 차이가 없어 PR을 만들 게 없습니다" 보고 후 종료
   - 원격 브랜치가 같은 이름으로 이미 있으면: 사용자에게 알리고 force-push가 아닌 일반 push로 진행

3. **PR 내용 분석**:
   - **모든 커밋을 읽음** (LATEST만 보지 말 것 — PR은 전체 커밋의 누적 의미)
   - 변경 파일 종류로 PR 성격 추정 (디자인 / 문서 / 기능 / 버그 수정)
   - title: 70자 이내, 한국어 또는 영문 — 짧고 명확하게
   - body: 한국어로 다음 구조

     ```markdown
     ## Summary
     - <변경 핵심 1>
     - <변경 핵심 2>
     - <변경 핵심 3>

     ## 주요 변경 파일
     - `<경로>` — <한 줄 설명>

     ## Test plan
     - [ ] <검증 항목 1>
     - [ ] <검증 항목 2>

     🤖 Generated with [Claude Code](https://claude.com/claude-code)
     ```

4. **사용자 검토**:
   - title + body 후보를 그대로 보여주고 "이대로 PR을 만들까요?" 명시적 승인 요청
   - 수정 요청 있으면 반영 후 다시 보여줌

5. **PR 생성**:
   - 원격 추적 없으면: `git push -u origin <branch>`
   - 있으면: `git push`
   - HEREDOC으로 PR 생성:
     ```bash
     gh pr create --title "<title>" --body "$(cat <<'EOF'
     ## Summary
     ...
     EOF
     )"
     ```

6. **결과 보고**:
   - PR URL을 사용자에게 한국어로 전달: "PR이 만들어졌습니다 → <URL>"
   - 다음 단계 안내: "검토 후 GitHub에서 직접 merge하시거나, 'merge해줘'라고 말씀해 주세요"

## 주의

- **main에 force push 절대 금지**. 다른 브랜치 force-push도 사용자가 명시적으로 요청한 경우에만
- **`--no-verify` 같은 hook bypass 금지**
- merge는 별도 절차 — `/pr`에 포함하지 않음
- 사용자가 일정 단위로 PR을 모아 만드는 패턴 — 너무 작은 단위로 PR을 쪼개라고 권하지 말 것
