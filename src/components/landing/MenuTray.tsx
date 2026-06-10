"use client";

import Link from "next/link";

// 메뉴 트레이 — Topbar 메뉴 버튼이 여는 다크 글래스 드롭다운. 항목은 /studio 진입(셸 단계).
const ITEMS = [
  { label: "Explore", href: "/studio", n: "01" },
  { label: "Saved Looks", href: "/studio", n: "02" },
  { label: "New Prompt", href: "/studio", n: "03" },
];

export function MenuTray({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-[60]" aria-hidden onClick={onClose} />
      )}
      <aside
        aria-hidden={!open}
        className={`fixed left-6 top-[76px] z-[70] w-[min(340px,calc(100vw-48px))] rounded-lg border border-white/12 bg-[rgba(20,24,30,0.85)] p-[18px] text-[#f1ece0] shadow-[0_22px_70px_rgba(0,0,0,0.25)] backdrop-blur-[18px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <p className="mb-3.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[rgba(241,236,224,0.64)]">
          Menu
        </p>
        {ITEMS.map((it) => (
          <Link
            key={it.label}
            href={it.href}
            onClick={onClose}
            className="flex min-h-12 items-center justify-between border-t border-[rgba(241,236,224,0.16)] text-[13px] font-extrabold uppercase tracking-[0.08em] transition-opacity hover:opacity-80"
          >
            <span>{it.label}</span>
            <span className="text-[11px] text-[rgba(241,236,224,0.48)]">
              {it.n}
            </span>
          </Link>
        ))}
      </aside>
    </>
  );
}
