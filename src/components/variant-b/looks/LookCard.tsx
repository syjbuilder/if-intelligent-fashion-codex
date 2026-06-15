"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { LookCardData } from "@/types/ui";
import { GarmentSvg } from "@/components/looks/GarmentSvg";

/** Variant B 룩 카드 — 다크 면 + 코랄 "+" 코너 + 실사/SVG 폴백. */
export function LookCard({
  look,
  onClick,
  className = "",
  layoutId,
}: {
  look: LookCardData;
  onClick?: (look: LookCardData) => void;
  className?: string;
  layoutId?: string;
}) {
  return (
    <motion.button
      type="button"
      layoutId={layoutId}
      onClick={() => onClick?.(look)}
      className={`group relative block aspect-[3/4] w-full overflow-hidden rounded-[2px] bg-b-surface text-left transition-transform duration-500 ease-expo hover:-translate-y-1 ${className}`}
    >
      {look.imageSrc ? (
        <Image
          src={look.imageSrc}
          alt={look.caption}
          fill
          sizes="(max-width:768px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-expo group-hover:scale-[1.05]"
        />
      ) : (
        <GarmentSvg
          tone={look.tone}
          className="absolute inset-0 h-full w-full p-7 text-b-light/60"
        />
      )}
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
      <span
        aria-hidden
        className="absolute left-2.5 top-2.5 font-bold text-b-accent/0 transition-colors duration-300 group-hover:text-b-accent"
      >
        +
      </span>
      <span
        aria-hidden
        className="absolute right-2.5 top-2.5 font-bold text-b-accent/0 transition-colors duration-300 group-hover:text-b-accent"
      >
        +
      </span>
      <span className="absolute bottom-3 left-3 z-10 text-[10px] font-extrabold uppercase tracking-[0.14em] text-b-light">
        {look.tag}
      </span>
    </motion.button>
  );
}
