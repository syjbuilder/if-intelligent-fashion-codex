"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { PromptSketchCard } from "./PromptSketchCard";

const BLOCKS = [
  { kw: "상상하면", body: "한 문장이면 충분합니다. 원하는 스타일의 옷을 표현해보세요." },
  { kw: "만들어지고", body: "AI가 그 상상을 입을 수 있는 룩으로 구성합니다." },
  { kw: "입을 수 있다", body: "마음에 들면 실제 구매처 상품으로 바로 이어집니다." },
] as const;

// 노출 임계(progress) — 코랄 라인과 동기. step은 감소하지 않는 latch(한 번 뜨면 유지).
// → 빠른 스크롤에도 메세지가 흐려지지 않고, 셋 다 켜진 뒤 언핀·다음 섹션 전환까지 선명히 남는다.
const STEPS = [0.03, 0.32, 0.58];
const LINE_END = 0.58; // 라인도 마지막 메세지와 함께 완주, 이후 0.58~1.0 동안 완성 프레임 유지.

const HEADING =
  "text-[clamp(32px,5vw,64px)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em] text-b-light";
const BODY = "mt-4 max-w-[42ch] text-t4 text-b-light/80";

/**
 * Variant B 서비스 소개 — 핀 고정 + 코랄 라인 진행 + 3블록 누적(latch).
 * 우측에 스크롤 동기 PromptSketchCard(프롬프트→실루엣→상품)로 좌측 3메세지를 시각화.
 * 메세지·라인·카드는 같은 임계에서 차례로 켜진 뒤 끝까지(언핀까지) 선명히 유지된다.
 * reduced-motion이면 정적 스택(핀/변환 없음)으로 폴백, 카드는 최종 상태.
 */
export function ServiceIntro() {
  const ref = useRef<HTMLElement>(null);
  const [reduced, setReduced] = useState(false);
  const [step, setStep] = useState(0);

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
  const lineScale = useTransform(scrollYProgress, [0, LINE_END], [0, 1]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    let s = 0;
    for (let i = 0; i < STEPS.length; i++) if (p >= STEPS[i]) s = i + 1;
    setStep((prev) => (s > prev ? s : prev)); // latch: 최대값 유지(감소 안 함)
  });

  if (reduced) {
    return (
      <section data-mode="static" className="bg-b-ink px-6 py-24 md:px-gutter">
        <div className="mx-auto grid max-w-[1280px] grid-cols-[2px_1fr] gap-8 md:grid-cols-[2px_1fr_1fr] md:gap-14">
          <div data-coral-line aria-hidden className="w-[2px] bg-b-accent" />
          <div data-blocks className="flex flex-col gap-12">
            {BLOCKS.map((b) => (
              <div key={b.kw}>
                <h3 className={HEADING}>{b.kw}</h3>
                <p className={BODY}>{b.body}</p>
              </div>
            ))}
          </div>
          <div className="hidden md:flex md:justify-center">
            <PromptSketchCard progress={scrollYProgress} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} data-mode="pinned" className="relative h-[220vh] bg-b-ink">
      <div className="sticky top-0 flex h-[100svh] items-center px-6 md:px-gutter">
        <div className="mx-auto grid w-full max-w-[1280px] grid-cols-[2px_1fr] gap-8 md:grid-cols-[2px_1fr_1fr] md:gap-14">
          <motion.div
            data-coral-line
            aria-hidden
            style={{ scaleY: lineScale }}
            className="h-[60vh] w-[2px] origin-top bg-b-accent"
          />
          <div data-blocks className="flex flex-col gap-10 md:gap-12">
            {BLOCKS.map((b, i) => (
              <div
                key={b.kw}
                className={`transition-all duration-700 ease-out ${
                  step > i ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                }`}
              >
                <h3 className={HEADING}>{b.kw}</h3>
                <p className={BODY}>{b.body}</p>
              </div>
            ))}
          </div>
          <div className="hidden md:flex md:justify-center">
            <PromptSketchCard progress={scrollYProgress} step={step} />
          </div>
        </div>
      </div>
    </section>
  );
}
