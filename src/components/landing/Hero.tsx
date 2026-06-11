"use client";

import { Cta } from "@/components/ui/Cta";
import { HeroFigure } from "@/components/landing/HeroFigure";
import { RevealWords } from "@/components/motion/RevealWords";
import { useReveal } from "@/components/motion/useReveal";

/**
 * 랜딩 hero — 한 메시지 + Get Started. 레이어 순서: 다크 3-layer 배경(bg-hero-dark)
 * → 좌측 마네킹 룩 로테이션(HeroFigure) → 반투명 스크림(.hero-scrim, 좌→우 어두워짐)
 * → 텍스트/CTA(z-10). 진입 시 fade-up.
 */
export function Hero() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section className="bg-hero-dark relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-[116px] text-center text-white-soft md:px-gutter">
      <HeroFigure />
      <div className="hero-scrim" aria-hidden />

      <div
        ref={ref}
        className={`relative z-10 flex flex-col items-center transition-all duration-1000 ease-expo ${
          visible
            ? "translate-y-0 opacity-100 blur-0"
            : "translate-y-4 opacity-0 blur-sm"
        }`}
      >
        <p className="text-t7 font-extrabold uppercase tracking-[0.18em] text-white-soft/60">
          Only AI Lookbook · Built for your day
        </p>
        <h1
          aria-label="Style your Imagination."
          className="mt-6 max-w-[14ch] text-t1 font-extrabold"
        >
          <RevealWords text="Style your Imagination." />
        </h1>
        <Cta variant="accent" href="/studio" className="mt-9">
          Get Started
        </Cta>
      </div>

      {/* scroll 큐 — Scroll 라벨 + 세로 accent 그라디언트 선(색상 통일) */}
      <div className="absolute bottom-9 left-1/2 z-10 -translate-x-1/2">
        <span className="scroll-cue">
          <span className="scroll-label">Scroll</span>
          <span className="scroll-line" />
        </span>
      </div>
    </section>
  );
}
