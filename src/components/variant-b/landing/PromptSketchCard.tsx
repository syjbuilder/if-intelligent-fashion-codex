"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";

const FULL = "여름 데이트, 미니멀 무드";

// GarmentSvg 'date' 톤 path d 복사 (원본 컴포넌트 불변, 여기서 stroke draw-on).
const DATE_PATHS = [
  "M40 28 Q50 34 60 28",
  "M40 28 L36 52 L30 118 L50 124 L70 118 L64 52 L60 28",
  "M36 52 Q50 60 64 52",
  "M40 28 L42 22 M60 28 L58 22",
];

/**
 * ServiceIntro 우측 글래스 카드 — 스크롤 진행(progress)에 동기:
 * [0,.33] 프롬프트 타이핑 → [.33,.63] 가먼트 실루엣 stroke 드로우 → [.66,1] 상품 칩 페이드.
 * 좌측 "상상하면→만들어지고→입을 수 있다" 메세지를 시각화. reduced면 최종 상태 정적.
 */
export function PromptSketchCard({ progress }: { progress: MotionValue<number> }) {
  const [reduced, setReduced] = useState(false);
  const [n, setN] = useState(0);

  // 텍스트 블록(0~0.15 / 0.2~0.38 / 0.42~0.6) 직후에 카드 단계가 오도록 타이밍.
  const typed = useTransform(progress, [0.03, 0.22], [0, FULL.length]);
  const draw = useTransform(progress, [0.25, 0.48], [0, 1]);
  const chip = useTransform(progress, [0.5, 0.66], [0, 1]);

  useMotionValueEvent(typed, "change", (v) => {
    const r = Math.max(0, Math.min(FULL.length, Math.round(v)));
    setN((prev) => (prev === r ? prev : r));
  });

  useEffect(() => {
    const r = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(r);
    if (r) setN(FULL.length);
  }, []);

  const shown = reduced ? FULL : FULL.slice(0, n);
  const pathLength: number | MotionValue<number> = reduced ? 1 : draw;
  const chipOpacity: number | MotionValue<number> = reduced ? 1 : chip;

  return (
    <div
      data-prompt-sketch-card
      className="relative flex w-full max-w-[360px] flex-col gap-6 rounded-[20px] border border-b-line bg-b-surface/60 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-[18px]"
    >
      {/* 프롬프트 입력 (PromptDock 어휘 모방, 스크롤 구동 표시 전용) */}
      <div
        data-prompt-zone
        className="flex items-center gap-2 rounded-full border border-b-line bg-b-surface/80 px-2 py-2 backdrop-blur-[18px]"
      >
        <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center text-t4 text-b-light/40">
          +
        </span>
        <span className="flex h-10 flex-1 items-center px-2 text-t4 text-b-light">
          {shown}
          <span
            aria-hidden
            className="ml-0.5 inline-block h-[1.1em] w-[2px] animate-pulse bg-b-accent"
          />
        </span>
        <span
          aria-hidden
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-b-accent text-b-ink"
        >
          ↑
        </span>
      </div>

      {/* 가먼트 실루엣 스케치 (stroke pathLength 드로우) */}
      <div className="grid flex-1 place-items-center py-2">
        <svg
          viewBox="0 0 100 140"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          data-sketch
          className="h-44 w-auto text-b-light"
        >
          {DATE_PATHS.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              style={{ pathLength }}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
      </div>

      {/* 상품 칩 */}
      <motion.div
        data-product-chip
        style={{ opacity: chipOpacity }}
        className="inline-flex items-center gap-2 self-start rounded-full border border-b-line bg-b-surface/60 px-3 py-1.5 backdrop-blur"
      >
        <span aria-hidden className="h-2 w-2 rounded-full bg-b-accent" />
        <span className="text-t7 text-b-light">데이트 슬립 원피스 · 구매처 보기</span>
      </motion.div>
    </div>
  );
}
