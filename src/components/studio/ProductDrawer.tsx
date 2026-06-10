"use client";

import { PRODUCTS_MOCK } from "@/lib/looks-fixtures";

const won = (n: number) => `₩${n.toLocaleString("ko-KR")}`;

/**
 * 룩별 상품 패널 — 데스크톱 우측 슬라이드, 모바일 하단 바텀시트(grab handle).
 * 상품 fetch·외부 구매 링크는 다음 phase. 'Buy Full Look'은 aria-disabled placeholder
 * (자체 결제 없음, 외부 몰 링크만 — ADR-004).
 */
export function ProductDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[160]"
      role="dialog"
      aria-modal="true"
      aria-label="상품 패널"
    >
      <div className="overlay-in absolute inset-0 bg-black/20" onClick={onClose} />
      <aside className="drawer-in absolute right-0 top-0 flex h-full w-[min(420px,92vw)] flex-col bg-white text-ink shadow-2xl md:w-[380px] max-md:inset-x-0 max-md:bottom-0 max-md:top-auto max-md:h-[min(82vh,640px)] max-md:w-full max-md:rounded-t-[22px]">
        {/* 모바일 grab handle */}
        <div className="mx-auto mt-3 h-1 w-11 rounded-full bg-line md:hidden" />

        <header className="flex items-start justify-between px-6 pt-5">
          <div>
            <p className="text-t8 font-extrabold uppercase tracking-[0.18em] text-accent">
              This look
            </p>
            <h2 className="mt-1 text-t3 font-extrabold">뉴트럴 테일러드 셋업</h2>
          </div>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full border border-line"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <ul className="divide-y divide-line">
            {PRODUCTS_MOCK.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-4 py-4"
              >
                <div>
                  <p className="text-t5 font-semibold">{p.name}</p>
                  <p className="text-t7 text-slate-body">
                    {p.brand} · {p.platform}
                  </p>
                </div>
                <span className="shrink-0 text-t5 font-extrabold">
                  {won(p.price)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="px-6 pb-6">
          <button
            type="button"
            aria-disabled="true"
            title="V0에서는 각 상품을 외부 온라인몰에서 구매합니다 (자체 결제 없음)"
            className="flex min-h-[62px] w-full cursor-not-allowed items-center justify-center rounded-full bg-ink/40 text-t6 font-extrabold uppercase tracking-[0.1em] text-white-soft"
          >
            Buy Full Look
          </button>
          <p className="mt-2 text-center text-t8 text-muted">
            각 상품은 외부 온라인몰에서 구매할 수 있어요 (다음 단계에서 연결).
          </p>
        </div>
      </aside>
    </div>
  );
}
