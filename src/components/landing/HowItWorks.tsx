"use client";

import { GarmentSvg } from "@/components/looks/GarmentSvg";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useReveal } from "@/components/motion/useReveal";
import type { LookTone } from "@/types/ui";

const STEPS: { num: string; title: string; desc: string; tone: LookTone }[] = [
  {
    num: "01",
    title: "Describe your day",
    desc: "상황·무드·예산을 한 문장으로 적어요. 빈 입력창 앞에서 막힐 필요 없이, 시즌 추천 프롬프트에서 시작해도 돼요.",
    tone: "office",
  },
  {
    num: "02",
    title: "AI reads the silhouette",
    desc: "AI가 의도를 읽고 전체 착장이 보이는 룩 보드를 그려요. 상의·하의·아우터까지 입을 수 있는 한 벌로.",
    tone: "date",
  },
  {
    num: "03",
    title: "Wear what you imagine",
    desc: "마음에 드는 룩에서 바로 국내 온라인몰 상품으로 연결돼요. 비슷한 룩 더 보기로 취향을 좁혀가요.",
    tone: "sport",
  },
];

/** How it works — 3-step 에디토리얼(카드 그리드 아님, ol.steps 단일 컬럼). 한 화면(100svh) 리듬. */
export function HowItWorks() {
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
          eyebrow="How it works"
          title={
            <>
              From <span className="text-accent">intention</span> to wearable.
            </>
          }
          titleLabel="From intention to wearable."
          sub="상상한 스타일을 문장으로 적으면, I.F가 여러 온라인몰을 가로질러 입을 수 있는 한 벌로 보여줍니다."
        />

        <ol className="mt-12">
          {STEPS.map((s) => (
            <li
              key={s.num}
              className="grid grid-cols-1 gap-6 border-t border-line py-7 first:border-t-0 md:grid-cols-[88px_minmax(0,1fr)_200px] md:gap-9 md:py-8"
            >
              {/* step-num은 accent 색이지만 워드 강조(text-accent) 카운트에서 제외 — raw hex 유지 */}
              <span className="text-t2 font-extrabold leading-none text-[#49476e]">
                {s.num}
              </span>
              <div>
                <h3 className="text-t3 font-extrabold text-ink">{s.title}</h3>
                <p className="mt-3 max-w-[40ch] text-left text-t6 text-ink-soft">
                  {s.desc}
                </p>
              </div>
              <div className="text-ink-soft/70">
                <GarmentSvg tone={s.tone} className="h-[132px] w-full" />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
