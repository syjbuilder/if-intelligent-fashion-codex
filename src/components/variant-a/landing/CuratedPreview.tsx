"use client";

import { Cta } from "@/components/ui/Cta";
import { LookCard } from "@/components/variant-a/looks/LookCard";
import { RevealWords } from "@/components/motion/RevealWords";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useReveal } from "@/components/motion/useReveal";
import { CURATED_LOOKS } from "@/lib/looks-fixtures";

/**
 * Variant A — Today's curated. 실사 룩 카드(variant-a LookCard: soft-glow + "+" 코너) 가로 레일.
 * magnific 여백 리듬 + trionn 마이크로 인터랙션 차용. 한 화면(100svh) 수렴.
 */
export function CuratedPreview() {
  const { ref, visible } = useReveal<HTMLElement>();
  return (
    <section
      ref={ref}
      className={`flex min-h-[100svh] flex-col justify-center bg-paper px-6 py-20 transition-all duration-700 ease-expo md:px-gutter ${
        visible ? "translate-y-0 opacity-100" : "translate-y-7 opacity-0"
      }`}
    >
      <div className="mx-auto w-full max-w-[1180px]">
        <SectionHeader
          eyebrow="Today's curated"
          title={<RevealWords text="Six directions to begin." />}
          titleLabel="Six directions to begin."
          sub="오늘의 큐레이션 룩 여섯 가지. 마음에 드는 방향에서 스튜디오를 시작하세요."
        />

        <div className="-mx-6 mt-10 overflow-x-auto px-6 md:-mx-gutter md:px-gutter">
          <div className="flex w-max snap-x snap-mandatory gap-3.5 pb-2">
            {CURATED_LOOKS.map((look) => (
              <div
                key={look.id}
                className="w-[clamp(232px,21vw,300px)] shrink-0 snap-start"
              >
                <LookCard look={look} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <Cta variant="dark" href="/a/studio">
            Start the studio
          </Cta>
        </div>
      </div>
    </section>
  );
}
