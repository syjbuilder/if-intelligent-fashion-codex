"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { LookCardData } from "@/types/ui";
import { GarmentSvg } from "@/components/looks/GarmentSvg";

/** Variant B 상세 좌측 룩 — ResultsScene plate와 동일 layoutId(b-look-*)로 morph. 크기는 부모 제어. */
export function LookDetailFigure({
  look,
  className = "",
}: {
  look: LookCardData;
  className?: string;
}) {
  return (
    <motion.div
      layoutId={`b-look-${look.id}`}
      className={`relative w-full overflow-hidden rounded-[2px] bg-b-surface ${className}`}
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
        <GarmentSvg tone={look.tone} className="h-full w-full p-12 text-b-light/60" />
      )}
    </motion.div>
  );
}
