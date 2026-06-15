"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

const BLOCKS = [
  { kw: "상상하면", body: "한 문장이면 충분합니다. 원하는 무드를 말로 그려보세요." },
  { kw: "만들어지고", body: "AI가 그 상상을 입을 수 있는 룩으로 구성합니다." },
  { kw: "입을 수 있다", body: "마음에 들면 실제 구매처 상품으로 바로 이어집니다." },
] as const;

// progress→state 매핑: 각 블록이 페이드인→유지→(마지막 제외) 페이드아웃하며 교차.
// useTransform은 mutable number[]을 요구 → as const(readonly) 금지.
const RANGES: { o: number[]; out: number[]; y: number[] }[] = [
  { o: [0, 0.08, 0.3, 0.38], out: [0, 1, 1, 0], y: [0, 0.08] },
  { o: [0.33, 0.41, 0.63, 0.71], out: [0, 1, 1, 0], y: [0.33, 0.41] },
  { o: [0.66, 0.74, 1, 1], out: [0, 1, 1, 1], y: [0.66, 0.74] },
];

const HEADING =
  "text-[clamp(32px,5vw,64px)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em] text-b-light";
const BODY = "mt-4 max-w-[42ch] text-t4 text-b-light/70";

function PinnedBlock({
  index,
  progress,
}: {
  index: number;
  progress: MotionValue<number>;
}) {
  const r = RANGES[index];
  const b = BLOCKS[index];
  const opacity = useTransform(progress, r.o, r.out);
  const y = useTransform(progress, r.y, [24, 0]);
  return (
    <motion.div style={{ opacity, y }} className="absolute inset-x-0 top-0">
      <h3 className={HEADING}>{b.kw}</h3>
      <p className={BODY}>{b.body}</p>
    </motion.div>
  );
}

/**
 * Variant B 서비스 소개 — 핀 고정 + 코랄 라인 진행 리빌 (trionn 키네틱).
 * 스크롤 진행에 맞춰 좌측 코랄 라인이 자라고 3개 소제목+본문이 순차 교차로 등장한다.
 * reduced-motion에서는 정적 스택(핀/변환 없음)으로 폴백.
 */
export function ServiceIntro() {
  const ref = useRef<HTMLElement>(null);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(
      typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  if (reduced) {
    return (
      <section data-mode="static" className="bg-b-ink px-6 py-24 md:px-gutter">
        <div className="mx-auto grid max-w-[1280px] grid-cols-[2px_1fr] gap-8 md:gap-14">
          <div data-coral-line aria-hidden className="w-[2px] bg-b-accent" />
          <div className="space-y-16">
            {BLOCKS.map((b) => (
              <div key={b.kw}>
                <h3 className={HEADING}>{b.kw}</h3>
                <p className={BODY}>{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} data-mode="pinned" className="relative h-[300vh] bg-b-ink">
      <div className="sticky top-0 flex h-[100svh] items-center px-6 md:px-gutter">
        <div className="mx-auto grid w-full max-w-[1280px] grid-cols-[2px_1fr] gap-8 md:gap-14">
          <motion.div
            data-coral-line
            aria-hidden
            style={{ scaleY: lineScale }}
            className="h-[60vh] w-[2px] origin-top bg-b-accent"
          />
          <div className="relative h-[60vh]">
            {BLOCKS.map((_, i) => (
              <PinnedBlock key={i} index={i} progress={scrollYProgress} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
