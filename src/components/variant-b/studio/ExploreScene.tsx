"use client";

import { EXPLORE_LOOKS, SEASON_PROMPTS } from "@/lib/looks-fixtures";
import { LookCard } from "@/components/variant-b/looks/LookCard";

/** Variant B Explore — 다크 + 콘덴스드 헤더 + 코랄 칩 + 실사 그리드. 도크는 페이지 레벨. */
export function ExploreScene({ onRefill }: { onRefill: (prompt: string) => void }) {
  return (
    <section className="mx-auto max-w-[1480px] px-6 pb-40 pt-[96px] md:px-gutter">
      <p className="text-t7 font-extrabold uppercase tracking-[0.24em] text-b-accent">
        Style Studio
      </p>
      <h1 className="mt-3 text-[clamp(32px,5vw,64px)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em] text-b-light">
        What will
        <br />
        you wear
      </h1>

      <div className="mt-5 flex flex-wrap gap-2">
        {SEASON_PROMPTS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onRefill(p)}
            className="rounded-full border border-b-line bg-b-surface px-4 py-2 text-t7 font-semibold text-b-light/80 transition-colors hover:border-b-accent hover:text-b-accent"
          >
            {p}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {EXPLORE_LOOKS.map((l) => (
          <LookCard key={l.id} look={l} onClick={(lk) => onRefill(lk.prompt)} />
        ))}
      </div>
    </section>
  );
}
