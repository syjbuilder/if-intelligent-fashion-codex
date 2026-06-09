"use client";

import { useState } from "react";
import { PromptDock } from "./PromptDock";
import { Chip } from "@/components/ui/Chip";
import { LookCard } from "@/components/looks/LookCard";
import { SEASON_PROMPTS, EXPLORE_LOOKS } from "@/lib/looks-fixtures";

/**
 * 워크스페이스 첫 화면 — 빈 입력창이 아니라 큐레이션 룩 + 시즌 데모 프롬프트('빈 입력창 마비' 방지).
 * 칩/카드 클릭은 입력값 보정(같은 셸 useState)까지만 — 생성은 onGenerate로 부모가 scene 토글.
 */
export function ExploreScene({
  onGenerate,
  tokensInsufficient = false,
}: {
  onGenerate: (prompt: string) => void;
  tokensInsufficient?: boolean;
}) {
  const [value, setValue] = useState("");

  return (
    <section className="min-h-screen bg-paper px-7 pb-40 pt-28">
      <div className="mx-auto max-w-[1480px]">
        <p className="text-t7 font-extrabold uppercase tracking-[0.18em] text-muted">
          Style Studio
        </p>
        <h1 className="mt-3 max-w-[24ch] text-t3 font-extrabold text-ink">
          Begin with a place, mood, and constraint.
        </h1>
        <p className="mt-3 max-w-[46ch] text-left text-t5 text-ink-soft">
          상황·무드·제약을 한 문장으로. 막막하면 아래 시즌 추천에서 시작하세요.
        </p>

        <div className="sticky top-[76px] z-20 mt-8 bg-paper/80 py-3 backdrop-blur">
          <PromptDock
            variant="search"
            value={value}
            onChange={setValue}
            onSubmit={onGenerate}
            tokensInsufficient={tokensInsufficient}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {SEASON_PROMPTS.map((p) => (
              <Chip key={p} variant="season" onClick={() => setValue(p)}>
                {p}
              </Chip>
            ))}
          </div>
        </div>

        <p className="mt-12 text-t7 font-extrabold uppercase tracking-[0.18em] text-muted">
          Curated for this week
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {EXPLORE_LOOKS.map((look) => (
            <LookCard key={look.id} look={look} onClick={(l) => setValue(l.prompt)} />
          ))}
        </div>
      </div>
    </section>
  );
}
