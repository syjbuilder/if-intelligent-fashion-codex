"use client";

import { useState } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/brand/BrandMark";
import { MenuTray, type MenuItem } from "./MenuTray";

/**
 * 공용 고정 헤더(랜딩·스튜디오). mix-blend-difference로 다크/페이퍼 위에서 자동 반전.
 * `.landing`/스튜디오 래퍼 바깥(형제)에 두고 래퍼에 transform/z 금지(stacking).
 * Menu 버튼 → MenuTray(controlled items). Login 버튼 → onLogin(현재 페이지에서 Auth 오버레이).
 */
export function Topbar({
  menuItems,
  onLogin,
}: {
  menuItems: MenuItem[];
  onLogin: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center px-6 py-5 text-white md:px-gutter">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="메뉴"
            className="flex items-center gap-2 justify-self-start"
          >
            <span className="flex flex-col gap-[3px]">
              <span className="block h-px w-5 bg-current" />
              <span className="block h-px w-5 bg-current" />
              <span className="block h-px w-5 bg-current" />
            </span>
            <span className="hidden text-t7 font-extrabold uppercase tracking-[0.18em] sm:inline">
              Menu
            </span>
          </button>
          <Link href="/" aria-label="홈으로" className="justify-self-center">
            <BrandMark className="text-white" />
          </Link>
          <button
            type="button"
            onClick={onLogin}
            className="justify-self-end text-t7 font-extrabold uppercase tracking-[0.18em] transition-opacity hover:opacity-70"
          >
            Login
          </button>
        </div>
      </header>
      <MenuTray
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={menuItems}
      />
    </>
  );
}
