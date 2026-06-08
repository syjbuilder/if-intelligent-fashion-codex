# src/services/ — 외부 API 래퍼 경계

외부 API 호출 래퍼는 이 디렉토리에 둔다 (ADR-007: `src/services/` AI 래퍼 경계).

규칙:
- 외부 API(OpenAI 등)는 **`src/app/api/` 라우트 핸들러 또는 서버 영역에서만** 호출한다 — 클라이언트 컴포넌트에서 직접 호출 금지(API 키 노출 방지, CLAUDE.md CRITICAL).
- Supabase 클라이언트는 여기 말고 `src/lib/supabase/`(server/browser)에 있다.

예정 자산:
- `openai.ts` — GPT Image 2 룩 이미지 생성 래퍼 (Phase 5, ADR-003).
- 상품 매칭(B-path)·프롬프트 해석 등 AI 파이프라인 래퍼.
