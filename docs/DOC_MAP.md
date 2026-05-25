# 문서 지도 (DOC_MAP)

> 저장소 안의 모든 문서가 어디 살고 누가 정본인지 한 페이지로 정리한다.
> **헷갈리면 이 문서부터 본다.**

## 사용법

- 문서를 **수정**할 때: 아래 "거울 (sync 필요)" 표에서 짝꿍 찾고, 둘 다 staging 후 `/sync-docs` → `/commit`.
- 문서를 **추가**할 때: 분류에 맞는 표에 한 줄 추가. CLAUDE.md를 같이 수정할 필요는 없다 (CLAUDE.md는 이 문서를 가리킬 뿐).
- 문서를 **이동·삭제**할 때: 이 표에서도 같이 갱신.

## 1. 정본 (Single Source of Truth)

`docs/`가 공식 운영 기준. 작업 시작 시 여기서부터 본다.

| 문서 | 역할 | 짝꿍(거울)이 있는지 |
|---|---|---|
| `docs/PRD.md` | 제품 정의·V0 범위·Non-Goals | ✓ 거울 있음 |
| `docs/ARCHITECTURE.md` | 디렉토리·데이터 흐름·런타임 패턴 | ✓ 거울 있음 |
| `docs/ADR.md` | 기술 결정 기록 (ADR-001~) | ✓ 거울 있음 |
| `docs/UI_GUIDE.md` | 현행 디자인 운영 스펙 (기준 시안: v0.6) | 단방향 archive |
| `docs/DATA_MODEL.md` | Supabase Postgres 스키마·RLS | ✓ 거울 있음 |
| `docs/API_CONTRACTS.md` | V0 API request/response 계약 | ✓ 거울 있음 |
| `docs/AI_PIPELINE.md` | 룩 생성·상품 매칭 파이프라인 | ✓ 거울 있음 |
| `docs/DOC_MAP.md` | 이 문서 — 거버넌스 지도 | (없음, 단독) |

## 2. 거울 (Mirror — sync 필요)

`docs/` 영문 정본이 한국어 원본과 짝을 이룬다. **한쪽만 수정하면 sync drift 발생** → pre-commit 경고 훅이 잡아준다.

| 영문 정본 (`docs/`) | 한국어 원본 | sync 방향 | 검증 기준 |
|---|---|---|---|
| `docs/PRD.md` | `기획/I.F V0 PRD.md` | 양방향 | V0 범위·Non-Goals·Acceptance Criteria |
| `docs/ARCHITECTURE.md` | `기술/I.F V0 TRD.md` (전반) | 양방향 | 디렉토리·데이터 흐름·패턴 |
| `docs/ADR.md` | `기획/I.F V0 PRD.md` ADR 섹션 + `기술/I.F V0 TRD.md` 21장 | 양방향 | ADR ID·근거·트레이드오프 |
| `docs/DATA_MODEL.md` | `기술/I.F V0 TRD.md` 15장 | 양방향 | 테이블 정의·RLS 정책 |
| `docs/API_CONTRACTS.md` | `기술/I.F V0 TRD.md` 16장 | 양방향 | 엔드포인트·스키마 |
| `docs/AI_PIPELINE.md` | `기획/If discovery summary.md` §9 | 양방향 | 프롬프트 파싱·상품 매칭·데이터 레버 |
| `docs/UI_GUIDE.md` | `디자인/I.F 디자인 계획 v0.0.md` | 단방향 (docs → archive) | 운영 값은 UI_GUIDE에만, archive는 버전 히스토리만 |

매핑 데이터는 `.githooks/sync-pairs.json`에도 동일하게 들어 있다 (훅 자동 검사용).

## 3. Archive (참고용, 변경 안 함)

이미 정본에 흡수됐거나 폐기 결정된 자산. 손대지 않는다.

| 위치 | 내용 | 비고 |
|---|---|---|
| `디자인/archive/` | `if-homepage-v0.0`~`v0.5*.html` (10개) | v0.6이 현행 기준. 폐기 시안은 archive 안 보냄 |
| `지원서/모두의창업/archive/` | `지원서_v0.0`~`v0.2.md` | 최신은 `지원서/모두의창업/지원서_v0.3.md` |
| `디자인/I.F 디자인 계획 v0.0.md` | 디자인 탐색·의사결정 archive | 운영 값은 `docs/UI_GUIDE.md`에만 |
| `기획/Read_history.md` | 대화·작업 환경 이전 히스토리 | 신규 작업 시 참고용 |
| `기술/TRD_사전_질문사항.txt` | 개발 방향 사전 의사결정 Q&A | 의사결정 추적용 |

## 4. 활성 한국어 원본 (정본의 거울 외)

거울 표에 없는 한국어 단독 문서.

| 문서 | 역할 |
|---|---|
| `기획/If discovery summary.md` | 리서치 요약 (AI_PIPELINE 외 섹션은 단독 자산) |
| `지원서/모두의창업/지원서_v0.3.md` | 모두의창업 지원서 현행 본 |
| `지원서/모두의창업/리서치.md` | 모두의창업 핵심 논리 |
| `지원서/모두의창업/질문정리.md` | 지원서 작성 Q&A |
| `디자인/광고영상/I.F 광고 영상 제작 계획 v0.3a_If_everywhere.md` | 광고 시안 A |
| `디자인/광고영상/I.F 광고 영상 제작 계획 v0.3b_Mind_to_Street.md` | 광고 시안 B |
| `디자인/레퍼런스/codex_prompts.md` | 디자인 수정 프롬프트 블록 |
| `개발_전_진행_체크리스트.md` | 개발 착수 준비 체크리스트 |

이들은 단독이므로 sync 훅이 안 잡는다. 짝꿍 만들고 싶으면 거울 표에 추가.

## 5. 운영 자산 (코드 아님)

자동화·설정·빌드 관련. 변경 시 CLAUDE.md CRITICAL 규칙과 상충 없는지 확인.

| 위치 | 역할 |
|---|---|
| `.claude/commands/` | 슬래시 명령 4개: `/sync-docs`, `/commit`, `/pr`, `/brief` |
| `.claude/hooks/` | Claude Code PreToolUse 가드: `tdd-guard`, `secret-guard`, `main-branch-guard` |
| `.claude/skills/` | 프로젝트 스킬: `harness-framework`, `harness-review` |
| `.claude/settings.json` | hooks 등록·timeout |
| `.githooks/pre-commit` | git pre-commit 검사 (lint/build/test + sync-warn) |
| `.githooks/sync-warn.sh` | docs ↔ 한국어 sync drift 경고 |
| `.githooks/sync-pairs.json` | 거울 매핑 데이터 (위 표 §2 미러) |
| `scripts/execute.py` | Harness phase 실행기 |

## 6. 제외 (Untracked, 의도적)

git에 안 들어가는 자산. `.gitignore`로 차단.

| 위치 | 사유 |
|---|---|
| `학습/` | 개인 학습 자료 (AI 개발·Claude 도구 노트, 외부 책 발췌) |
| `학습/바이브코딩/` | "바이브 코딩 바이블" 발췌·원본 PDF |
| `디자인/레퍼런스/*.mp4`, `*.png`, `_analysis_*/` | 레퍼런스 영상·스크린샷·프레임 추출물 (대용량) |
| `기획/서비스 개발 전체 과정.png` | 대용량 이미지 |
| `.claude/settings.local.json` | 개인별 Claude Code 권한·모드 |
| `.pytest_cache/`, `node_modules/`, `.next/`, `__pycache__/` | 빌드·캐시 자동 생성물 |

**중요**: 팀에 공유하고 싶으면 `docs/` 또는 `.claude/commands/`로 옮겨야 한다. `학습/`에 두면 영원히 untracked.

## 7. 깨진 참조 / 미생성 권고

| 가리키는 곳 | 가리키는 대상 | 상태 |
|---|---|---|
| `개발_전_진행_체크리스트.md` | `디자인/디자인_레퍼런스_스터디.md` | (생성 권고 — 아직 없음) |
| `개발_전_진행_체크리스트.md` | `디자인/디자인_방향성.md` | (생성 권고 — 아직 없음) |

이들은 "생성 예정" 항목이므로 깨진 링크는 아니지만, 만들 때까지는 비어 있음을 명시.

## 일상 작업 흐름 (3단계)

1. **수정** → 정본(`docs/`) 또는 거울(한국어 원본) 한쪽 편집
2. `/sync-docs` → 짝꿍 자동 반영, diff 검토 후 승인
3. `/commit` → pre-commit 훅이 sync drift·시크릿·TDD 검사 → 통과 시 `/pr`

깜빡하고 한쪽만 staging → pre-commit `sync-warn.sh`가 "짝꿍도 함께 sync할까요? (y/N)" 경고.
