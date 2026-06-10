"use client";

import { useState } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/brand/BrandMark";
import { MenuTray } from "./MenuTray";

/**
 * 랜딩 고정 헤더. mix-blend-difference로 다크/페이퍼 영역 위에서 자동 반전.
 * `.landing` 바깥(page의 main 형제)에 배치해야 stacking이 동작한다 — 래퍼에 transform/z 금지.
 * Menu 버튼 → MenuTray 토글. Login은 /studio 진입.
 */
export function Topbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center px-[34px] py-5 text-white">
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
          <BrandMark className="justify-self-center text-white" />
          <Link
            href="/studio"
            className="justify-self-end text-t7 font-extrabold uppercase tracking-[0.18em] transition-opacity hover:opacity-70"
          >
            Login
          </Link>
        </div>
      </header>
      <MenuTray open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
