"use client";

import { SectionHeader } from "@/components/ui/SectionHeader";
import { Chip } from "@/components/ui/Chip";
import { EXPLORE_LOOKS, SEASON_PROMPTS } from "@/lib/looks-fixtures";
import { LookCard } from "@/components/variant-a/looks/LookCard";

/**
 * Variant A Explore 피드 — 실사 룩 카드 그리드 + 시즌 데모 칩.
 * 프롬프트 도크는 페이지 레벨 고정(하단)이라 여기 없음. 카드/칩 클릭은 도크에 prefill(onRefill).
 * 하단 도크와 겹치지 않게 pb-40.
 */
export function ExploreScene({ onRefill }: { onRefill: (prompt: string) => void }) {
  return (
    <section className="mx-auto max-w-[1480px] px-6 pb-40 pt-[88px] md:px-gutter">
      <SectionHeader
        as="h1"
        eyebrow="Style Studio"
        title="무엇을 입어볼까요"
        sub="한 문장이면 충분해요. 마음에 드는 큐레이션을 골라 다듬어도 좋아요."
      />

      <div className="mt-4 flex flex-wrap gap-2">
        {SEASON_PROMPTS.map((p) => (
          <Chip key={p} variant="season" onClick={() => onRefill(p)}>
            {p}
          </Chip>
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
