"use client";

type Variant = "dock" | "search";

/**
 * 프롬프트 입력 도크 — controlled input + 생성. 외부 API 호출 없음(onSubmit은 부모가 scene 토글).
 * tokensInsufficient면 생성 비활성 + 단일 차단 안내(토큰 카운터/'무료' 변동 표시 금지 — ADR-009/014).
 */
export function PromptDock({
  value,
  onChange,
  onSubmit,
  tokensInsufficient = false,
  placeholder = "오늘 입고 싶은 룩을 한 문장으로…",
  variant = "dock",
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (v: string) => void;
  tokensInsufficient?: boolean;
  placeholder?: string;
  variant?: Variant;
  className?: string;
}) {
  const submit = () => {
    if (!tokensInsufficient && value.trim()) onSubmit(value.trim());
  };

  const shell =
    variant === "search"
      ? "bg-white/90 border border-line text-ink"
      : "bg-[rgba(13,16,22,0.58)] text-white-soft backdrop-blur-[18px]";

  return (
    <div className={className}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className={`flex items-center gap-2 rounded-full px-2 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.18)] ${shell}`}
      >
        <button
          type="button"
          aria-label="추가"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-current/20 text-lg"
        >
          +
        </button>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-12 flex-1 bg-transparent px-2 text-t5 outline-none placeholder:text-muted"
        />
        <button
          type="button"
          onClick={submit}
          disabled={tokensInsufficient}
          aria-label="룩 생성"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ink text-white-soft transition-opacity disabled:opacity-40"
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
