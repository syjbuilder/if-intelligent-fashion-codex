---
description: docs/ 영문 폴더와 기획/·기술/·디자인/ 한글 폴더 간 동기화 검사·반영
---

I.F 프로젝트의 영문 docs와 한글 원본 폴더 간 sync를 검사·동기화하는 작업입니다. 사용자 메모리에 "문서 sync는 디퍼 금지"가 명시되어 있어 매번 즉시 처리합니다.

## sync 매핑 (CLAUDE.md 기준)

`docs/`가 공식 single source of truth, 한글 폴더가 원본 보관소.

| docs/ 영문 (공식) | 한글 원본 (보관소) |
|---|---|
| `docs/PRD.md` | `기획/I.F V0 PRD.md` |
| `docs/ADR.md` | `기획/I.F V0 PRD.md` (ADR 섹션) |
| `docs/ARCHITECTURE.md` | `기술/I.F V0 TRD.md` |
| `docs/DATA_MODEL.md` | `기술/I.F V0 TRD.md` |
| `docs/API_CONTRACTS.md` | `기술/I.F V0 TRD.md` |
| `docs/AI_PIPELINE.md` | `기술/I.F V0 TRD.md` |
| `docs/UI_GUIDE.md` | `디자인/I.F 디자인 계획 v0.0.md` |

## 절차

1. **최근 변경 추출** (병렬 실행):
   - `git log --since="2 weeks ago" --name-only --pretty=format:"%h %ad %s" --date=short -- docs/ 기획/ 기술/ 디자인/`
   - `git status` 미커밋 변경 (한글 폴더는 공백·한글 이스케이프 주의)
   - `git diff HEAD -- docs/ 기획/ 기술/ 디자인/` (미커밋 diff)

2. **drift 분석**:
   - 각 매핑쌍을 비교해 한쪽만 최근에 변경되었는지 확인
   - drift 있는 쌍을 사용자에게 리스트로 보여줌:
     ```
     drift 감지:
     - docs/ADR.md (오늘 변경 — 새 ADR-010 추가) ↔ 기획/I.F V0 PRD.md (3일 전, sync 필요)
     - docs/ARCHITECTURE.md (어제 변경 — 새 모듈 추가) ↔ 기술/I.F V0 TRD.md (5일 전, sync 필요)
     ```
   - drift 없으면 "모든 매핑이 sync된 상태입니다" 보고 후 종료

3. **사용자 확인**:
   - "이 쌍들을 sync합니다. 진행할까요? (특정 쌍만 골라서 할 수도 있습니다)" 승인 요청
   - 일부만 sync 선택 가능

4. **sync 실행**:
   - 영문 docs/가 최신 → 한글 원본의 해당 섹션을 한국어로 갱신
   - 한글 원본이 최신 → 영문 docs/에 의미·구조 반영
   - 둘 다 같은 날 바뀌었으면: 어느 쪽이 정본인지 사용자에게 확인 후 진행
   - **단순 번역 X**. 의미·구조·voice 보존하면서 양쪽 언어 컨벤션에 맞게 작성

5. **diff 보여주기**:
   - sync 결과 각 파일의 변경 부분을 사용자에게 보여줌
   - "이대로 저장할까요?" 최종 승인 받은 뒤 저장

6. **결과 보고**: 
   - 어떤 파일이 어떻게 sync되었는지 한국어 요약
   - 다음 단계 안내: "이제 `/commit`으로 sync 결과를 기록하세요" 또는 "이어서 `/pr`을 만들까요?"

## 주의

- **단순 번역 X**. 영문 docs/는 짧고 명확한 단일 진실, 한글 원본은 결정의 배경·맥락·voice를 더 풍부하게 — 한글 원본의 voice를 함부로 깎지 말 것
- 새 파일을 만들지 말 것 — 기존 파일의 섹션 추가/수정만
- ADR은 docs/ADR.md에 정식 등록, 기획/I.F V0 PRD.md의 ADR 섹션엔 결정 요약만 반영
- TRD에는 기술 결정의 "왜"가 풍부히 들어있으므로 docs/와 sync할 때 그 voice를 보존
- sync 실행 전 항상 사용자 승인 — 의도와 다른 방향으로 sync되면 되돌리기 어려움
