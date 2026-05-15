# I.F (Intelligent Fashion) — 제품 개발 저장소

> **Wear what you imagine.**
> 텍스트 프롬프트로 상상한 패션을 AI 룩 이미지로 시각화하고, 국내 쇼핑몰의
> 실제 상품으로 연결하는 AI 패션 탐색 서비스. 한국 20–30대 여성 데일리 패션 타겟.

이 저장소는 **I.F를 실제로 만들기 위한 개발 중심 저장소**입니다.
기획·디자인 원본도 함께 들어 있지만, **공식 기준은 `docs/`와 `CLAUDE.md`** 에 있습니다.

## 폴더 지도

```
📦 코덱스/
├─ 🔧 제품을 만드는 도구  ─ 에이전트가 "항상 먼저" 보는 곳 (공식 기준)
│   ├─ docs/             공식 요약 문서
│   │   ├─ PRD.md            제품 요구사항 (V0 범위)
│   │   ├─ ARCHITECTURE.md   기술 구조
│   │   ├─ ADR.md            기술 결정 기록
│   │   └─ UI_GUIDE.md       디자인·컴포넌트 규칙
│   ├─ CLAUDE.md         에이전트 작업 규칙 (CRITICAL 규칙 포함)
│   ├─ .claude/          Claude Code 설정·훅·스킬
│   ├─ .githooks/        커밋 전 lint/build/test 강제
│   ├─ scripts/          Harness 자동화 (execute.py)
│   └─ (앞으로) src/      코드
│
└─ 📚 원본 자료·시안  ─ "더 자세한 원본이 필요할 때만" 들추는 곳
    ├─ 기획/              I.F V0 PRD 원본, Discovery 요약
    ├─ 기술/              I.F V0 TRD 원본
    ├─ 디자인/            홈페이지 시안 (v0.0 → v0.4.1), 광고영상 계획, 레퍼런스
    ├─ 문서_모두의 창업/  외부 제출용 지원서 (제품 개발과 직접 무관)
    └─ 바이브 코딩 스터디/ 학습 자료
```

## 어디를 보면 되나

**규칙: `docs/`가 공식 기준(single source of truth). 한글 폴더는 원본 보관소.**

| 알고 싶은 것 | 보는 곳 |
|--------------|---------|
| 무슨 제품인가, V0 범위 | `docs/PRD.md` |
| 기술 구조 (Next.js, Supabase 등) | `docs/ARCHITECTURE.md` |
| 왜 그렇게 결정했나 | `docs/ADR.md` |
| UI 색상·폰트·컴포넌트 | `docs/UI_GUIDE.md` |
| 최신 디자인 시안 | `디자인/if-homepage-v0.4.1.html` |
| 에이전트가 따라야 할 규칙 | `CLAUDE.md` |
| 더 자세한 기획 원본 | `기획/I.F V0 PRD.md` |
| 더 자세한 기술 원본 | `기술/I.F V0 TRD.md` |

## 작업 흐름 (비개발자 + AI 에이전트)

1. **`main`에서는 직접 작업하지 않습니다.** `main`은 공식 기준본 전용.
2. 새 작업을 시작할 때:
   ```bash
   git switch main
   git pull
   git switch -c feat/무슨작업
   ```
3. 에이전트(Claude/Codex)는 코드를 바꾸기 전 `docs/`를 먼저 읽도록 되어 있습니다
   (`CLAUDE.md`가 그렇게 시킴).
4. 작업이 끝나면 PR을 열어 검토 후 `main`에 합칩니다.

## 자동화 (Harness)

큰 작업(3단계 이상, 여러 파일 동시 변경, 인증/DB/AI/결제 같은 위험한 영역)은
`harness-framework` 스킬로 단계별 설계 후 `python scripts/execute.py`로 실행합니다.
단순 문서 수정·작은 HTML 변경은 Harness 없이 직접 작업해도 됩니다.

## 더 알아보기

- 작업 규칙 전체: [`CLAUDE.md`](./CLAUDE.md)
- 개발 준비 현황: [`개발_전_진행_체크리스트.md`](./개발_전_진행_체크리스트.md)
