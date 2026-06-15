"use client";

import type { FormEvent } from "react";

/**
 * Variant A 프롬프트 도크 — iPhone 글래스(.glass-search) pill.
 * 페이지가 화면 중앙 하단 고정 컨테이너로 감싸 explore→results→detail 전 scene에서 지속.
 */
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
      className={`glass-search flex items-center gap-2 rounded-full border border-line px-2 py-2 shadow-[0_18px_60px_rgba(26,26,26,0.14)] ${className}`}
    >
      <span
        aria-hidden
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-t4 text-ink/40"
      >
        +
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 flex-1 bg-transparent text-t4 text-ink outline-none placeholder:text-muted"
      />
      <button
        type="submit"
        aria-label="룩 생성"
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-white-soft transition-transform duration-300 hover:-translate-y-0.5"
      >
        ↑
      </button>
    </form>
  );
}
