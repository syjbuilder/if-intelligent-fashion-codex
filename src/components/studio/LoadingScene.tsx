"use client";

import { useEffect } from "react";

/**
 * 생성 중 화면 — 빈 화면 금지(진행 텍스트 노출). 도시/건축 아닌 '패션 작업' 언어(옷걸이 라인업).
 * onDone이 있으면 데모 자동 전환(다음 phase에서 실제 생성 완료 이벤트로 교체).
 */
export function LoadingScene({
  promptLabel,
  onDone,
  autoAdvanceMs = 2200,
  tone = "light",
}: {
  promptLabel?: string;
  onDone?: () => void;
  autoAdvanceMs?: number;
  /** light = 기본(slate scene) / dark = Variant B(다크+코랄) */
  tone?: "light" | "dark";
}) {
  useEffect(() => {
    if (!onDone) return;
    const t = setTimeout(onDone, autoAdvanceMs);
    return () => clearTimeout(t);
  }, [onDone, autoAdvanceMs]);

  const dark = tone === "dark";

  return (
    <section
      className={`relative flex min-h-screen flex-col items-center justify-center px-6 text-center ${
        dark ? "bg-b-ink text-b-light" : "bg-slate-scene text-white-soft"
      }`}
    >
      <div className="relative z-10 flex flex-col items-center">
        <p className={`text-t3 font-extrabold ${dark ? "text-b-accent" : ""}`}>
          Reading the silhouette
        </p>
        <p className={`mt-3 text-t5 ${dark ? "text-b-light/70" : "text-white-soft/70"}`}>
          {promptLabel ? `‘${promptLabel}’` : "당신의"} 룩을 그리고 있어요…
        </p>
        <svg
          aria-hidden
          className={`mt-12 h-32 w-72 ${dark ? "text-b-accent/40" : "text-white-soft/45"}`}
          viewBox="0 0 280 130"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {[20, 90, 160, 230].map((x) => (
            <g key={x}>
              <path d={`M${x + 20} 14 a4 4 0 1 1 0.1 0 M${x + 20} 18 L${x + 20} 26`} />
              <path d={`M${x + 20} 26 L${x + 4} 36 L${x + 36} 36 Z`} />
              <path d={`M${x + 4} 40 L${x} 110 L${x + 40} 110 L${x + 36} 40`} />
            </g>
          ))}
          <line x1="6" y1="14" x2="274" y2="14" />
        </svg>
      </div>
    </section>
  );
}
