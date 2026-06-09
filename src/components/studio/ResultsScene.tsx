"use client";

import { useState } from "react";
import { GarmentSvg } from "@/components/looks/GarmentSvg";
import { Chip } from "@/components/ui/Chip";
import type { LookTone } from "@/types/ui";

export const RESULT_SLIDES: {
  tone: LookTone;
  tag: string;
  title: string;
  desc: string;
}[] = [
  {
    tone: "office",
    tag: "LOOK 01 · OFFICE",
    title: "뉴트럴 테일러드 셋업",
    desc: "베이지 톤온톤 셋업에 구조적인 블레이저. 출근부터 미팅까지 단정하게 떨어지는 실루엣.",
  },
  {
    tone: "date",
    tag: "LOOK 02 · DATE",
    title: "러블리 미디 원피스",
    desc: "부드러운 드레이프의 미디 원피스에 가벼운 가디건. 저녁 약속에 어울리는 무드.",
  },
  {
    tone: "sport",
    tag: "LOOK 03 · SPORT",
    title: "애슬레저 캐주얼",
    desc: "후디와 조거의 편안한 셋업. 주말 브런치와 산책을 가로지르는 데일리.",
  },
];

const REFINE_CHIPS = ["더 캐주얼하게", "색 바꾸기", "가격대 낮추기"];

/**
 * 결과 carousel — 룩 보드가 먼저(상품 그리드 먼저 X). mini-action 3패턴(ADR-009):
 * ① 다시 생성 ② 정제 칩(새 turn) ③ 이런 스타일 더(More Like This). + 상품 보기(드로어).
 * 좌우 이동은 useState index만. 생성·상품 fetch는 다음 phase.
 */
export function ResultsScene({
  onOpenDrawer,
  onRegenerate,
  onRefine,
  onMoreLike,
}: {
  onOpenDrawer?: () => void;
  onRegenerate?: () => void;
  onRefine?: (chip: string) => void;
  onMoreLike?: () => void;
}) {
  const [index, setIndex] = useState(0);
  const slide = RESULT_SLIDES[index];
  const total = RESULT_SLIDES.length;
  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  return (
    <section className="relative min-h-screen bg-paper">
      <div className="sticky top-0 z-20 flex items-center justify-center gap-4 py-4">
        <button
          type="button"
          aria-label="이전 룩"
          onClick={prev}
          className="grid h-9 w-9 place-items-center rounded-full bg-ink/70 text-white-soft"
        >
          ←
        </button>
        <span className="text-t7 text-muted">
          {index + 1} / {total}
        </span>
        <button
          type="button"
          aria-label="다음 룩"
          onClick={next}
          className="grid h-9 w-9 place-items-center rounded-full bg-ink/70 text-white-soft"
        >
          →
        </button>
      </div>

      <div className="mx-auto grid max-w-[1180px] items-center gap-8 px-7 pb-40 md:grid-cols-2">
        <div
          className={`tone-${slide.tone} relative flex aspect-[3/4] items-center justify-center rounded-card`}
        >
          <GarmentSvg tone={slide.tone} className="h-3/4 w-3/4" />
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-t7 font-extrabold uppercase tracking-[0.18em] text-muted">
            {slide.tag}
          </p>
          <h2 className="mt-2 text-t2 font-extrabold text-ink">{slide.title}</h2>
          <p className="mt-4 max-w-[42ch] text-left text-t5 text-slate-body">
            {slide.desc}
          </p>

          {/* mini-action ② 정제 칩 — silent filter 아님(새 conversation turn 자리) */}
          <div className="mt-6 flex flex-wrap gap-2">
            {REFINE_CHIPS.map((c) => (
              <Chip key={c} variant="refine" onClick={() => onRefine?.(c)}>
                {c}
              </Chip>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-t6 font-extrabold uppercase tracking-[0.1em]">
            {/* ① 다시 생성 */}
            <button
              type="button"
              onClick={onRegenerate}
              className="rounded-full border border-ink/20 px-5 py-3 text-ink transition-colors hover:bg-cream"
            >
              다시 생성
            </button>
            {/* ③ More Like This */}
            <button
              type="button"
              onClick={onMoreLike}
              className="rounded-full border border-ink/20 px-5 py-3 text-ink transition-colors hover:bg-cream"
            >
              이런 스타일 더
            </button>
            <button
              type="button"
              onClick={onOpenDrawer}
              className="rounded-full bg-ink px-5 py-3 text-white-soft transition-colors hover:bg-[#2a2520]"
            >
              상품 보기
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
