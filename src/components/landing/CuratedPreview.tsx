"use client";

import { Cta } from "@/components/ui/Cta";
import { LookCard } from "@/components/looks/LookCard";
import { useReveal } from "@/components/motion/useReveal";
import { CURATED_LOOKS } from "@/lib/looks-fixtures";

/** Today's curated — Explore 미리보기 6장 + 스튜디오 진입 CTA. */
export function CuratedPreview() {
  const { ref, visible } = useReveal<HTMLElement>();
  return (
    <section
      ref={ref}
      className={`bg-paper px-[34px] py-[142px] transition-all duration-700 ease-expo ${
        visible ? "translate-y-0 opacity-100" : "translate-y-7 opacity-0"
      }`}
    >
      <div className="mx-auto max-w-[1180px]">
        <p className="text-t7 font-extrabold uppercase tracking-[0.18em] text-muted">
          Today&apos;s curated
        </p>
        <h2 className="mt-4 text-t2 font-extrabold text-ink">
          Six directions to begin.
        </h2>
        <p className="mt-6 max-w-[46ch] text-left text-t4 text-ink-soft">
          오늘의 큐레이션 룩 여섯 가지. 마음에 드는 방향에서 스튜디오를 시작하세요.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-3">
          {CURATED_LOOKS.map((look) => (
            <LookCard key={look.id} look={look} />
          ))}
        </div>

        <div className="mt-12">
          <Cta variant="dark" href="/studio">
            Start the studio
          </Cta>
        </div>
      </div>
    </section>
  );
}
