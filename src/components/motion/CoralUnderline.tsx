"use client";

import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * 코랄 언더라인 — 뷰포트 진입 시 좌→우로 그어지는 액센트 라인 (trionn 라인 드로우 모티프).
 * 장식용(aria-hidden, 단어 액센트 예산 밖). reduced-motion은 MotionProvider의 reducedMotion="user"가 무력화.
 * 폭은 소비처가 className으로 지정한다 (예: w-10 / w-full).
 */
export function CoralUnderline({ className = "" }: { className?: string }) {
  return (
    <motion.span
      aria-hidden
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: EASE }}
      className={`block h-[2px] origin-left bg-b-accent ${className}`}
    />
  );
}
