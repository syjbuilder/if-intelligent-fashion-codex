---
description: 새 세션에 복붙할 수 있는 자족적 진행 브리프 생성
---

I.F 프로젝트의 현재 진행상황을 새 Claude 세션에 그대로 복붙할 수 있는 자족적 마크다운 브리프로 출력합니다.

## 수집할 정보 (병렬 실행)

1. **저장소 상태**:
   - `git branch --show-current` — 현재 브랜치
   - `git status` — 미커밋 변경
   - `git log --oneline -10` — 최근 커밋 10개
   - `git diff main...HEAD --stat` — main 대비 변경 요약 (main이 아니면)

2. **진행 중인 phase** (있다면):
   - `phases/index.json` 확인
   - 활성 phase의 `phases/{name}/index.json`
   - 마지막 실행된 step 번호와 status

3. **열린 PR**:
   - `gh pr list --author @me --state open --json number,title,url` (가능하면)

4. **최근 docs 변경**:
   - `git log --since="1 week ago" --name-only --pretty=format:"%h %ad %s" --date=short -- docs/ 기획/ 기술/ 디자인/`

5. **CLAUDE.md 최근 변경**:
   - `git log --since="2 weeks ago" --oneline -- CLAUDE.md`
   - 새 CRITICAL 규칙이나 명령어가 추가되었는지 확인

## 브리프 출력 형식

사용자가 복사하기 쉽도록 마크다운 코드블록(triple backtick)으로 감싸서 출력:

````markdown
```markdown
# I.F 프로젝트 진행 브리프 (<YYYY-MM-DD>)

## 지금 어디
- 브랜치: `<branch-name>`
- 마지막 커밋: `<hash>` <message>
- 미커밋 변경: <파일 개수>개 (또는 "없음")
- 열린 PR: <개수>개 (URL 리스트 — 있으면)

## 진행 중인 작업
<무엇을 하고 있었는지 1-3문장으로>

진행 중인 phase: `<phase-name>` step <N> (있으면)

## 미해결 결정
- <사용자 답변 대기 중인 질문>
- <합의 필요한 트레이드오프>

(없으면 "없음" 또는 섹션 생략)

## 다음 step
1. <구체적으로 다음에 할 일>
2. <그 다음>

## 참고 위치
- 관련 코드: `<경로>`
- 관련 docs: `<경로>` (예: `docs/PRD.md`, `docs/ADR.md`)
- 최신 디자인 시안: `<경로>`
- 최근 ADR: ADR-<번호> <제목>

## 컨텍스트 (새 세션이 모르는 것)
<이번 세션에서만 합의된 사항, 시도해본 접근과 결과, 사용자의 의도 등>

---

**새 세션 사용법**: 이 브리프를 새 Claude 세션의 첫 메시지로 붙여넣으세요. `CLAUDE.md`와 함께 자동으로 읽혀 컨텍스트가 복원됩니다.
```
````

## 출력 후 사용자에게 한국어 안내

브리프 출력 뒤에 다음 안내를 덧붙임:

> 위 마크다운을 복사해 메모장이나 Notion에 저장하세요. 새 Claude 세션을 열 때 첫 메시지로 그대로 붙여넣으면 됩니다.
> CLAUDE.md는 자동으로 로드되므로 브리프엔 CLAUDE.md 내용을 반복하지 않았습니다.

## 주의

- **자족성**: 이번 세션 대화를 모르는 Claude가 읽어도 이해 가능해야 함
- **시크릿 금지**: API 키·비공개 결정·내부 회의 내용 같은 민감 정보는 포함하지 말 것
- **압축**: 너무 길면 새 세션에 부담 — 핵심만. 상세 내용은 docs/ 경로로 포인터만 남김
- **포인터 명확화**: 새 세션이 어디부터 읽으면 되는지 (`CLAUDE.md`, `docs/PRD.md`, 최신 디자인 HTML 등) 명시
- **CLAUDE.md 중복 X**: CLAUDE.md는 새 세션에서 자동 로드됨. 브리프엔 "이번 세션 한정 컨텍스트"만
- **저장은 사용자 책임**: /brief는 출력만 함. 사용자가 직접 메모장·Notion·메시지 등에 복사해야 다음 세션에서 사용 가능
