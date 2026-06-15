"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { RESULT_LOOKS } from "@/lib/looks-fixtures";
import { GarmentSvg } from "@/components/looks/GarmentSvg";

const REFINE = ["더 캐주얼하게", "색 바꾸기", "가격대 낮추기"];

/** Variant B 결과 — 다크 plate 3장(클릭 → onDetail, layoutId morph) + 코랄 자세히보기 + mini-action. */
export function ResultsScene({
  onDetail,
  onRegenerate,
  onMoreLike,
  onRefine,
}: {
  onDetail: (lookId: string) => void;
  onRegenerate?: () => void;
  onMoreLike?: () => void;
  onRefine?: (chip: string) => void;
}) {
  return (
    <section className="mx-auto w-full max-w-[1320px] px-6 pb-40 pt-[96px] md:px-gutter">
      <p className="text-t7 font-extrabold uppercase tracking-[0.24em] text-b-accent">
        Your looks
      </p>
      <h2 className="mt-2 text-[clamp(28px,4vw,52px)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em] text-b-light">
        Three ways
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {RESULT_LOOKS.map((l, i) => (
          <button
            key={l.id}
            type="button"
            onClick={() => onDetail(l.id)}
            className="group relative block aspect-[3/4] w-full overflow-hidden rounded-[2px] bg-b-surface text-left"
          >
            <motion.div layoutId={`b-look-${l.id}`} className="absolute inset-0">
              {l.imageSrc ? (
                <Image
                  src={l.imageSrc}
                  alt={l.caption}
                  fill
                  sizes="(max-width:640px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-expo group-hover:scale-[1.04]"
                />
              ) : (
                <GarmentSvg tone={l.tone} className="h-full w-full p-10 text-b-light/60" />
              )}
            </motion.div>
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/0 to-black/0" />
            <span aria-hidden className="absolute left-3 top-3 font-bold text-b-accent">
              +
            </span>
            <span className="absolute bottom-3 left-3.5 z-10 text-b-light">
              <span className="block text-[10px] font-extrabold uppercase tracking-[0.16em] opacity-75">
                Look 0{i + 1}
              </span>
              <span className="mt-0.5 block text-t5 font-semibold">{l.caption}</span>
            </span>
            <span className="absolute bottom-3 right-3 z-10 rounded-full bg-b-accent px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-b-ink transition-transform duration-300 group-hover:-translate-y-0.5">
              자세히보기 →
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {REFINE.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onRefine?.(c)}
            className="rounded-full border border-b-line px-4 py-2 text-t7 font-semibold text-b-light/80 transition-colors hover:border-b-accent hover:text-b-accent"
          >
            {c}
          </button>
        ))}
        <div className="ml-auto flex gap-2 text-t7 font-extrabold uppercase tracking-[0.1em]">
          <button
            type="button"
            onClick={onRegenerate}
            className="rounded-full border border-b-line px-4 py-2 text-b-light transition-colors hover:border-b-accent"
          >
            다시 생성
          </button>
          <button
            type="button"
            onClick={onMoreLike}
            className="rounded-full border border-b-line px-4 py-2 text-b-light transition-colors hover:border-b-accent"
          >
            이런 스타일 더
          </button>
        </div>
      </div>
    </section>
  );
}
