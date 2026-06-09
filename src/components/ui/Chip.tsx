"use client";

import type { ReactNode } from "react";

type Variant = "default" | "season" | "refine";

const VARIANTS: Record<Variant, string> = {
  // 다크 배경용 반투명 흰
  default:
    "bg-white/10 text-white-soft border border-white/10 backdrop-blur-[10px] hover:bg-white/20",
  // 라이트 배경용 솔리드 흰 + ink border
  season:
    "bg-white text-ink border border-[rgba(26,26,26,0.22)] hover:bg-cream",
  refine:
    "bg-white text-ink border border-[rgba(26,26,26,0.25)] hover:bg-cream",
};

/** 칩 — season(시즌 데모 프롬프트) / refine(정제 칩, 새 turn 자리) / default(다크). */
export function Chip({
  variant = "default",
  onClick,
  className = "",
  children,
}: {
  variant?: Variant;
  onClick?: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center rounded-full px-[14px] py-2 text-t7 font-semibold transition-colors duration-300 ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
