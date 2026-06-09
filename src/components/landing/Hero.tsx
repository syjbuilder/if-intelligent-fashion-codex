"use client";

import { Cta } from "@/components/ui/Cta";
import { useReveal } from "@/components/motion/useReveal";

/** 랜딩 hero — 한 메시지 + Get Started. 다크 3-layer 배경 + grain. 진입 시 fade-up. */
export function Hero() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section className="bg-hero-dark relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-[52px] pb-20 pt-[116px] text-center text-white-soft">
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
        <h1 className="mt-6 max-w-[14ch] text-t1 font-extrabold">
          Style your Imagination.
        </h1>
        <Cta variant="accent" href="/studio" className="mt-9">
          Get Started
        </Cta>
      </div>
      <div className="absolute bottom-9 left-1/2 z-10 -translate-x-1/2 text-t8 uppercase tracking-[0.18em] text-white-soft/55">
        Scroll
      </div>
    </section>
  );
}
