"use client";

import { LazyMotion, MotionConfig, domMax } from "framer-motion";
import type { ReactNode } from "react";

/**
 * 두 variant가 공유하는 framer-motion 루트.
 * - domMax: layoutId(공유요소 expand)·drag 포함 풀 feature 세트.
 *   (domAnimation은 layout 애니메이션 미포함 → Variant A expand가 안 됨)
 * - reducedMotion="user": prefers-reduced-motion을 framer 레벨에서 존중
 *   (기존 globals.css의 reduced-motion 블록과 정합).
 * 각 variant layout.tsx에서 마운트한다.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domMax}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
