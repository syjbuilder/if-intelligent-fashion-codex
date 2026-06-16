"use client";

import { motion } from "framer-motion";
import { BrandMark } from "@/components/brand/BrandMark";

const EASE = [0.16, 1, 0.3, 1] as const;
const CONTAINER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const CORNER = {
  hidden: { opacity: 0, scale: 0.6 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE } },
};
const MARK = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const CORNERS = ["left-0 top-0", "right-0 top-0", "bottom-0 left-0", "bottom-0 right-0"];

/**
 * 히어로 우측 IF 로고 인트로 — trionn식 블루프린트 조립(코랄 "+" 코너 + IF 마크 스태거).
 * 헤드라인 등장 전 우측 빈 공간을 채우고, 조립 후 은은한 브랜드 마크로 안착. 장식용(aria-hidden).
 * reduced면 최종 상태로 즉시(애니메이션 없음).
 */
export function HeroLogoIntro({ reduced = false }: { reduced?: boolean }) {
  return (
    <motion.div
      aria-hidden
      data-hero-logo
      initial={reduced ? "show" : "hidden"}
      animate="show"
      variants={reduced ? undefined : CONTAINER}
      className="relative grid h-[clamp(180px,22vw,300px)] w-[clamp(180px,22vw,300px)] place-items-center"
    >
      {CORNERS.map((pos) => (
        <motion.span
          key={pos}
          aria-hidden
          variants={reduced ? undefined : CORNER}
          className={`absolute ${pos} text-t4 font-bold text-b-accent`}
        >
          +
        </motion.span>
      ))}
      <motion.div variants={reduced ? undefined : MARK}>
        <BrandMark className="text-b-light" />
      </motion.div>
    </motion.div>
  );
}
