"use client";

type Variant = "dock" | "search";
type Size = "md" | "lg";

const SHELL: Record<Variant, string> = {
  // 페이지 공용 글래스 어휘(.glass-search) 재사용 — 스크롤 위에서도 도크가 떠 보이지 않게
  search:
    "glass-search border border-line text-ink shadow-[0_18px_60px_rgba(26,26,26,0.10)]",
  dock: "bg-[rgba(13,16,22,0.58)] text-white-soft backdrop-blur-[18px] shadow-[0_12px_40px_rgba(0,0,0,0.18)]",
};

const FIELD: Record<Size, string> = { md: "h-12", lg: "h-14" };
const TEXT: Record<Size, string> = { md: "text-t5", lg: "text-t4" };
const BTN: Record<Size, string> = { md: "h-12 w-12", lg: "h-14 w-14" };

/**
 * 프롬프트 입력 도크 — controlled input + 생성. 외부 API 호출 없음(onSubmit은 부모가 scene 토글).
 * tokensInsufficient면 생성 비활성 + 단일 차단 안내(토큰 카운터/'무료' 변동 표시 금지 — ADR-009/014).
 * size=lg는 ExploreScene 무대용(헤딩 직하 주연 입력창).
 */
export function PromptDock({
  value,
  onChange,
  onSubmit,
  tokensInsufficient = false,
  placeholder = "오늘 입고 싶은 룩을 한 문장으로…",
  variant = "dock",
  size = "md",
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (v: string) => void;
  tokensInsufficient?: boolean;
  placeholder?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  const submit = () => {
    if (!tokensInsufficient && value.trim()) onSubmit(value.trim());
  };

  return (
    <div className={className}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className={`flex items-center gap-2 rounded-full px-2 py-2 ${SHELL[variant]}`}
      >
        <button
          type="button"
          aria-label="추가"
          className={`grid ${BTN[size]} shrink-0 place-items-center rounded-full border border-current/20 text-lg`}
        >
          +
        </button>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${FIELD[size]} flex-1 bg-transparent px-2 ${TEXT[size]} outline-none placeholder:text-muted`}
        />
        <button
          type="button"
          onClick={submit}
          disabled={tokensInsufficient}
          aria-label="룩 생성"
          className={`grid ${BTN[size]} shrink-0 place-items-center rounded-full bg-ink text-white-soft transition-opacity disabled:opacity-40`}
        >
          ↑
        </button>
      </form>
      {tokensInsufficient && (
        <p role="status" className="mt-2 text-center text-t7 text-muted">
          토큰을 모두 사용했어요. 체험이 종료되었습니다.
        </p>
      )}
    </div>
  );
}
