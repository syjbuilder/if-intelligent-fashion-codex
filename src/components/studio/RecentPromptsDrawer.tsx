"use client";

// 최근 프롬프트 — Menu의 "Recent prompts"가 여는 우측 슬라이드 드로어(v0.7 drawer-history).
// mock 데이터(셸). 실제 history는 다음 phase(generation_history 연동).
const RECENT = [
  { text: "출근룩 뉴트럴 톤 미니멀 셋업", ago: "20분 전" },
  { text: "봄 데이트룩, 파스텔 미니멀", ago: "1시간 전" },
  { text: "주말 애슬레저 캐주얼 셋업", ago: "어제" },
];

export function RecentPromptsDrawer({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect?: (text: string) => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[160]"
      role="dialog"
      aria-modal="true"
      aria-label="최근 프롬프트"
    >
      <div className="overlay-in absolute inset-0 bg-black/25" onClick={onClose} />
      <aside className="drawer-in absolute right-0 top-0 flex h-full w-[min(480px,92vw)] flex-col bg-[#15151c] text-[#f1ece0] shadow-2xl max-md:inset-x-0 max-md:bottom-0 max-md:top-auto max-md:h-[min(82vh,640px)] max-md:w-full max-md:rounded-t-[22px]">
        <div className="mx-auto mt-3 h-1 w-11 rounded-full bg-white/15 md:hidden" />
        <header className="flex items-start justify-between px-6 pt-5">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[rgba(241,236,224,0.58)]">
              Recent
            </p>
            <h2 className="mt-1 text-t3 font-extrabold">최근 프롬프트</h2>
          </div>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/15"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {RECENT.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-20 text-center">
              <p className="text-t5 text-[rgba(241,236,224,0.7)]">
                아직 최근 프롬프트가 없어요.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {RECENT.map((r) => (
                <li key={r.text}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect?.(r.text);
                      onClose();
                    }}
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/5 px-4 py-4 text-left transition-colors hover:bg-white/10"
                  >
                    <span className="truncate text-t6">{r.text}</span>
                    <span className="shrink-0 text-[11px] text-[rgba(241,236,224,0.5)]">
                      {r.ago}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border border-white/15 py-3 text-t7 font-extrabold uppercase tracking-[0.1em] transition-colors hover:bg-white/10"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full bg-white-soft py-3 text-t7 font-extrabold uppercase tracking-[0.1em] text-ink"
          >
            Start a new prompt
          </button>
        </div>
      </aside>
    </div>
  );
}
