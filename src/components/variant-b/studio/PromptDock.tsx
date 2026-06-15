"use client";

import type { FormEvent } from "react";

/** Variant B 프롬프트 도크 — 다크 글래스 + 코랄 제출. 페이지가 중앙 하단 고정으로 감쌈. */
export function PromptDock({
  value,
  onChange,
  onSubmit,
  placeholder = "오늘 입고 싶은 룩을 한 문장으로…",
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(value);
  };
  return (
    <form
      onSubmit={submit}
      className={`flex items-center gap-2 rounded-full border border-b-line bg-b-surface/80 px-2 py-2 shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-[18px] ${className}`}
    >
      <span
        aria-hidden
        className="grid h-10 w-10 shrink-0 place-items-center text-t4 text-b-light/40"
      >
        +
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 flex-1 bg-transparent text-t4 text-b-light outline-none placeholder:text-b-light/40"
      />
      <button
        type="submit"
        aria-label="룩 생성"
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-b-accent text-b-ink transition-transform duration-300 hover:-translate-y-0.5"
      >
        ↑
      </button>
    </form>
  );
}
