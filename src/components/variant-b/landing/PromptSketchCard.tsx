"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { GARMENT_PATHS } from "@/components/looks/GarmentSvg";

const FULL = "여름 데이트, 미니멀 무드";
const PLACEHOLDER = "원하는 스타일의 옷을 표현해보세요";

// GarmentSvg 'date' 톤 path d (단일 출처 공유). 여기서는 스크롤에 맞춰 stroke draw-on.
const DATE_PATHS = GARMENT_PATHS.date;

// 내부 latch 임계(부모가 step을 안 줄 때 폴백) — ServiceIntro STEPS와 동일.
const STEPS = [0.03, 0.32, 0.58];

/**
 * ServiceIntro 우측 글래스 카드 — 좌측 3메세지와 동기된 step(1·2·3)에 따라 3단계가 "누적":
 * step1 "상상하면" 프롬프트 타이핑 → step2 "만들어지고" 가먼트 실루엣(옅은 고스트 위 드로우)
 * → step3 "입을 수 있다" 상품 카드(구매처 연결). step은 감소하지 않는 latch라 한 번 뜬 단계는
 * 페이드아웃 없이 끝까지 또렷이 유지 → 마지막 프레임에 프롬프트·룩·상품이 모두 선명히 배치.
 * step 미전달(테스트/reduced)이면 progress로 내부 latch. reduced면 최종 정적.
 */
export function PromptSketchCard({
  progress,
  step,
}: {
  progress: MotionValue<number>;
  step?: number;
}) {
  const [reduced, setReduced] = useState(false);
  const [n, setN] = useState(0);
  const [internalStep, setInternalStep] = useState(0);

  const typed = useTransform(progress, [0.04, 0.22], [0, FULL.length]);
  const draw = useTransform(progress, [0.34, 0.56], [0, 1]); // 실루엣 드로우(스크럽)

  useMotionValueEvent(typed, "change", (v) => {
    const r = Math.max(0, Math.min(FULL.length, Math.round(v)));
    setN((prev) => (prev === r ? prev : r));
  });
  useMotionValueEvent(progress, "change", (p) => {
    let s = 0;
    for (let i = 0; i < STEPS.length; i++) if (p >= STEPS[i]) s = i + 1;
    setInternalStep((prev) => (s > prev ? s : prev)); // latch
  });

  useEffect(() => {
    const r = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(r);
    if (r) setN(FULL.length);
  }, []);

  const s = reduced ? 3 : step ?? internalStep;
  const typedText = reduced || s >= 2 ? FULL : s >= 1 ? FULL.slice(0, n) : "";
  const showPlaceholder = !reduced && s < 1;
  const sketchShown = reduced || s >= 2;
  const productShown = reduced || s >= 3;
  const pathLength: number | MotionValue<number> = reduced ? 1 : draw;

  return (
    <div
      data-prompt-sketch-card
      className="relative flex w-full max-w-[360px] flex-col gap-5 rounded-[20px] border border-b-line bg-b-surface/60 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-[18px]"
    >
      {/* 1) 프롬프트 입력 — "상상하면" */}
      <div
        data-prompt-zone
        className="flex items-center gap-2 rounded-full border border-b-line bg-b-surface/80 px-2 py-2 backdrop-blur-[18px]"
      >
        <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center text-t4 text-b-light/40">
          +
        </span>
        <span className="flex h-10 flex-1 items-center px-2 text-t6 text-b-light">
          {showPlaceholder ? (
            <span className="text-b-light/35">{PLACEHOLDER}</span>
          ) : (
            typedText
          )}
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

      {/* 2) 가먼트 실루엣 — "만들어지고" (옅은 고스트 위에 stroke 드로우, 한 번 뜨면 유지) */}
      <div className="relative grid min-h-[188px] flex-1 place-items-center">
        {/* 룩 고스트 — 항상 옅게 보이는 '스케치 패드' (빈 공백 방지) */}
        <svg
          viewBox="0 0 100 140"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className="absolute h-[176px] w-auto text-b-light/[0.08]"
        >
          {DATE_PATHS.map((d, i) => (
            <path key={i} d={d} vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
        {/* 드로우 레이어 — 스크롤에 맞춰 그려지고, step2부터 또렷이 유지 */}
        <svg
          viewBox="0 0 100 140"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          data-sketch
          className={`relative h-[176px] w-auto text-b-light transition-opacity duration-500 ${
            sketchShown ? "opacity-100" : "opacity-0"
          }`}
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

      {/* 3) 상품 카드 — "입을 수 있다" (구매처 연결을 또렷한 제품 행으로, 뜨면 유지) */}
      <div
        data-product-chip
        className={`flex items-center gap-3 rounded-2xl border border-b-line bg-b-surface/70 p-3 backdrop-blur transition-all duration-500 ${
          productShown ? "opacity-100 translate-y-0" : "translate-y-3 opacity-0"
        }`}
      >
        <span
          aria-hidden
          className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-b-ink/60"
        >
          <svg
            viewBox="0 0 100 140"
            className="h-7 w-auto text-b-light/80"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M40 28 L30 118 L50 124 L70 118 L60 28" />
          </svg>
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-t6 font-semibold text-b-light">데이트 슬립 원피스</span>
          <span className="text-t8 text-b-light/50">무신사 · 데일리룩</span>
        </span>
        <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full border border-b-accent/60 px-3 py-1.5 text-t8 font-semibold text-b-accent">
          구매처 보기 ↗
        </span>
      </div>
    </div>
  );
}
