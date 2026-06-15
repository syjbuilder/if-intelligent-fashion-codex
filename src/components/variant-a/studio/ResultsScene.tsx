"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Chip } from "@/components/ui/Chip";
import { RESULT_LOOKS } from "@/lib/looks-fixtures";
import { GarmentSvg } from "@/components/looks/GarmentSvg";

const REFINE_CHIPS = ["더 캐주얼하게", "색 바꾸기", "가격대 낮추기"];

/**
 * Variant A 결과 — 룩 plate 3장(실사). 각 카드의 "자세히보기" → onDetail(lookId)로 detail scene 진입
 * (룩이 layoutId로 좌측 확대 morph). 기존 hover 상품 오버레이는 제거(detail scene이 대체).
 * mini-action 3패턴(ADR-009): 정제 칩 / 다시 생성 / 이런 스타일 더.
 */
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
    <section className="mx-auto w-full max-w-[1320px] px-6 pb-40 pt-[88px] md:px-gutter">
      <div className="mb-5">
        <p className="text-t8 font-extrabold uppercase tracking-[0.18em] text-muted">
          Your looks
        </p>
        <h2 className="mt-1 text-t3 font-extrabold text-ink">
          세 가지 방향, 모두 입을 수 있게.
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {RESULT_LOOKS.map((l, i) => (
          <button
            key={l.id}
            type="button"
            onClick={() => onDetail(l.id)}
            className={`tone-${l.tone} group relative block aspect-[3/4] w-full overflow-hidden rounded-card text-left`}
          >
            <motion.div layoutId={`look-${l.id}`} className="absolute inset-0">
              {l.imageSrc ? (
                <Image
                  src={l.imageSrc}
                  alt={l.caption}
                  fill
                  sizes="(max-width:640px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-expo group-hover:scale-[1.04]"
                />
              ) : (
                <GarmentSvg tone={l.tone} className="h-full w-full p-10" />
              )}
            </motion.div>

            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
            <span className="absolute right-3 top-3 z-10 text-[13px] font-extrabold text-white-soft/70">
              0{i + 1}
            </span>
            <div className="absolute bottom-3 left-3.5 z-10 text-white-soft">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] opacity-75">
                Look 0{i + 1}
              </p>
              <p className="mt-0.5 text-t5 font-semibold">{l.caption}</p>
            </div>
            {/* 항상 보이는 affordance (hover 시 강조) */}
            <span className="absolute bottom-3 right-3 z-10 rounded-full bg-white-soft px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink shadow-[0_6px_20px_rgba(0,0,0,0.25)] transition-transform duration-300 group-hover:-translate-y-0.5">
              자세히보기 →
            </span>
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-2">
          {REFINE_CHIPS.map((c) => (
            <Chip key={c} variant="refine" onClick={() => onRefine?.(c)}>
              {c}
            </Chip>
          ))}
        </div>
        <div className="ml-auto flex gap-2 text-t7 font-extrabold uppercase tracking-[0.1em]">
          <button
            type="button"
            onClick={onRegenerate}
            className="rounded-full border border-ink/20 px-4 py-2 text-ink transition-colors hover:bg-cream"
          >
            다시 생성
          </button>
          <button
            type="button"
            onClick={onMoreLike}
            className="rounded-full border border-ink/20 px-4 py-2 text-ink transition-colors hover:bg-cream"
          >
            이런 스타일 더
          </button>
        </div>
      </div>
    </section>
  );
}
