"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { LookCardData } from "@/types/ui";
import { GarmentSvg } from "@/components/looks/GarmentSvg";

/**
 * Variant A 룩 카드 — 실사 이미지(next/image) + GarmentSvg 폴백.
 * 레퍼런스 차용: magnific soft-glow(hover box-shadow) + trionn "+" 코너 마커(hover 등장).
 * layoutId를 주면 detail figure로 photo→photo morph(공유요소 전환).
 */
export function LookCard({
  look,
  onClick,
  className = "",
  priority = false,
  layoutId,
}: {
  look: LookCardData;
  onClick?: (look: LookCardData) => void;
  className?: string;
  priority?: boolean;
  layoutId?: string;
}) {
  return (
    <motion.button
      type="button"
      layoutId={layoutId}
      onClick={() => onClick?.(look)}
      className={`group relative block aspect-[3/4] w-full overflow-hidden rounded-card text-left tone-${look.tone} shadow-[0_0_0_rgba(73,71,110,0)] transition-[transform,box-shadow] duration-500 ease-expo hover:-translate-y-0.5 hover:shadow-[0_22px_60px_rgba(73,71,110,0.22)] ${className}`}
    >
      {look.imageSrc ? (
        <Image
          src={look.imageSrc}
          alt={look.caption}
          fill
          sizes="(max-width:768px) 50vw, 25vw"
          priority={priority}
          className="object-cover transition-transform duration-700 ease-expo group-hover:scale-[1.04]"
        />
      ) : (
        <GarmentSvg
          tone={look.tone}
          className="absolute inset-0 h-full w-full p-7 opacity-90 transition-transform duration-700 ease-expo group-hover:scale-[1.05]"
        />
      )}

      {/* 가독용 다크 스크림 */}
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/0" />

      {/* trionn "+" 코너 마커 (hover 등장) */}
      {["left-2 top-2", "right-2 top-2"].map((pos) => (
        <span
          key={pos}
          aria-hidden
          className={`pointer-events-none absolute ${pos} z-10 text-[11px] font-bold leading-none text-white-soft/0 transition-colors duration-300 group-hover:text-white-soft/70`}
        >
          +
        </span>
      ))}

      <span className="absolute bottom-3 left-3 z-10 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white-soft">
        {look.tag}
      </span>
      <span className="absolute bottom-3 right-3 z-10 max-w-[58%] text-right text-[10px] font-normal leading-tight text-white-soft/80">
        {look.caption}
      </span>
    </motion.button>
  );
}
