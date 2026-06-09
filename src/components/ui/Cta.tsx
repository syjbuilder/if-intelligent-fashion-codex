"use client";

import type { ReactNode } from "react";

type Variant = "accent" | "dark" | "gate";

const VARIANTS: Record<Variant, string> = {
  accent: "cta-accent", // Muted Slate 글래스 (globals @layer components)
  dark: "bg-ink text-white-soft hover:bg-[#2a2520]",
  gate: "bg-ink text-white-soft",
};

const BASE =
  "inline-flex min-h-[56px] min-w-[200px] items-center justify-center rounded-full px-7 text-t6 font-extrabold uppercase tracking-[0.12em] transition-transform duration-300 ease-smooth hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50";

/**
 * 공유 pill CTA. href가 있으면 <a>, 없으면 <button>.
 * onClick은 Client 부모가 주입(라우팅/scene 토글). 외부 API 호출은 하지 않는다.
 */
export function Cta({
  variant = "dark",
  href,
  onClick,
  disabled = false,
  type = "button",
  className = "",
  children,
}: {
  variant?: Variant;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
  children: ReactNode;
}) {
  const cls = `${BASE} ${VARIANTS[variant]} ${className}`;
  if (href && !disabled) {
    return (
      <a href={href} onClick={onClick} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}
