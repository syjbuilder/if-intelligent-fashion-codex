"use client";

import { useState } from "react";
import { PromptDock } from "./PromptDock";
import { Chip } from "@/components/ui/Chip";
import { LookCard } from "@/components/looks/LookCard";
import { RevealWords } from "@/components/motion/RevealWords";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SEASON_PROMPTS, EXPLORE_LOOKS } from "@/lib/looks-fixtures";

/**
 * 워크스페이스 첫 화면 — 빈 입력창이 아니라 큐레이션 룩 + 시즌 데모 프롬프트('빈 입력창 마비' 방지).
 * 프롬프트 도크는 헤딩 직하 760px 블록('질문이 곧 무대') — sticky는 도크 pill만, 칩은 non-sticky.
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
    <section className="min-h-screen bg-paper px-6 pb-40 pt-28 md:px-gutter">
      <div className="mx-auto max-w-[1480px]">
        <SectionHeader
          as="h1"
          eyebrow="Style Studio"
          title={<RevealWords text="Begin with a place, mood, and constraint." />}
          titleLabel="Begin with a place, mood, and constraint."
          sub="상황·무드·제약을 한 문장으로. 막막하면 아래 시즌 추천에서 시작하세요."
        />

        <div className="sticky top-[72px] z-20 mt-9 max-w-[760px]">
          <PromptDock
            variant="search"
            size="lg"
            value={value}
            onChange={setValue}
            onSubmit={onGenerate}
            tokensInsufficient={tokensInsufficient}
          />
        </div>
        <div className="mt-4 flex max-w-[760px] flex-wrap gap-2">
          {SEASON_PROMPTS.map((p) => (
            <Chip key={p} variant="season" onClick={() => setValue(p)}>
              {p}
            </Chip>
          ))}
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
