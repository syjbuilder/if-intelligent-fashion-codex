"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { LookCardData } from "@/types/ui";
import { GarmentSvg } from "@/components/looks/GarmentSvg";

/**
 * 상세 좌측 확대 룩 — ResultsScene plate와 동일 layoutId로 photo→photo morph(좌측 확대 이동).
 */
export function LookDetailFigure({ look }: { look: LookCardData }) {
  return (
    <motion.div
      layoutId={`look-${look.id}`}
      className={`tone-${look.tone} relative aspect-[3/4] w-full overflow-hidden rounded-card`}
    >
      {look.imageSrc ? (
        <Image
          src={look.imageSrc}
          alt={look.caption}
          fill
          priority
          sizes="(max-width:1024px) 100vw, 50vw"
          className="object-cover"
        />
      ) : (
        <GarmentSvg tone={look.tone} className="h-full w-full p-12" />
      )}
    </motion.div>
  );
}
