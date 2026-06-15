"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { LookCardData } from "@/types/ui";
import { GarmentSvg } from "@/components/looks/GarmentSvg";

/**
 * 상세 좌측 확대 룩 — ResultsScene plate와 동일 layoutId로 photo→photo morph.
 * 크기는 부모가 className으로 제어(상세는 컬럼 높이 채움 → 한 화면 핏).
 */
export function LookDetailFigure({
  look,
  className = "",
}: {
  look: LookCardData;
  className?: string;
}) {
  return (
    <motion.div
      layoutId={`look-${look.id}`}
      className={`tone-${look.tone} relative w-full overflow-hidden rounded-card ${className}`}
    >
      {look.imageSrc ? (
        <Image
          src={look.imageSrc}
          alt={look.caption}
          fill
          priority
          sizes="(max-width:1024px) 100vw, 45vw"
          className="object-cover"
        />
      ) : (
        <GarmentSvg tone={look.tone} className="h-full w-full p-12" />
      )}
    </motion.div>
  );
}
