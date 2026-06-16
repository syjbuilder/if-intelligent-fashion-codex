"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { PromptSketchCard } from "./PromptSketchCard";

const BLOCKS = [
  { kw: "상상하면", body: "한 문장이면 충분합니다. 원하는 무드를 말로 그려보세요." },
  { kw: "만들어지고", body: "AI가 그 상상을 입을 수 있는 룩으로 구성합니다." },
  { kw: "입을 수 있다", body: "마음에 들면 실제 구매처 상품으로 바로 이어집니다." },
] as const;

// 누적 리빌: 각 블록이 임계에서 페이드인 후 1로 유지(useTransform 클램프, 페이드아웃 없음)
// → 스크롤 끝에 상상하면(위)/만들어지고(중)/입을 수 있다(아래) 3개 모두 표시.
const ACC: { o: [number, number]; y: [number, number] }[] = [
  { o: [0.0, 0.2], y: [0.0, 0.12] },
  { o: [0.33, 0.5], y: [0.33, 0.45] },
  { o: [0.66, 0.85], y: [0.66, 0.78] },
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
  const b = BLOCKS[index];
  const opacity = useTransform(progress, ACC[index].o, [0, 1]);
  const y = useTransform(progress, ACC[index].y, [24, 0]);
  return (
    <motion.div style={{ opacity, y }}>
      <h3 className={HEADING}>{b.kw}</h3>
      <p className={BODY}>{b.body}</p>
    </motion.div>
  );
}

/**
 * Variant B 서비스 소개 — 핀 고정 + 코랄 라인 진행 + 3블록 누적 리빌(끝에 모두 표시).
 * 우측에 스크롤 동기 PromptSketchCard(프롬프트→실루엣→상품)로 메세지를 시각화.
 * reduced-motion이면 정적 스택(핀/변환 없음)으로 폴백, 카드는 최종 상태.
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
        <div className="mx-auto grid max-w-[1280px] grid-cols-[2px_1fr] gap-8 md:grid-cols-[2px_1fr_minmax(280px,360px)] md:gap-14">
          <div data-coral-line aria-hidden className="w-[2px] bg-b-accent" />
          <div data-blocks className="flex flex-col gap-12">
            {BLOCKS.map((b) => (
              <div key={b.kw}>
                <h3 className={HEADING}>{b.kw}</h3>
                <p className={BODY}>{b.body}</p>
              </div>
            ))}
          </div>
          <div className="hidden md:block">
            <PromptSketchCard progress={scrollYProgress} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} data-mode="pinned" className="relative h-[300vh] bg-b-ink">
      <div className="sticky top-0 flex h-[100svh] items-center px-6 md:px-gutter">
        <div className="mx-auto grid w-full max-w-[1280px] grid-cols-[2px_1fr] gap-8 md:grid-cols-[2px_1fr_minmax(280px,360px)] md:gap-14">
          <motion.div
            data-coral-line
            aria-hidden
            style={{ scaleY: lineScale }}
            className="h-[60vh] w-[2px] origin-top bg-b-accent"
          />
          <div data-blocks className="flex flex-col gap-10 md:gap-12">
            {BLOCKS.map((_, i) => (
              <PinnedBlock key={i} index={i} progress={scrollYProgress} />
            ))}
          </div>
          <div className="hidden md:block">
            <PromptSketchCard progress={scrollYProgress} />
          </div>
        </div>
      </div>
    </section>
  );
}
