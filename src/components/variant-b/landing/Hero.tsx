"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { RevealWords } from "@/components/motion/RevealWords";
import { CoralUnderline } from "@/components/motion/CoralUnderline";
import { HeroLogoIntro } from "./HeroLogoIntro";

const EASE = [0.16, 1, 0.3, 1] as const;
const LEFT_CONTAINER = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: EASE,
      when: "beforeChildren" as const,
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};
const LEFT_ITEM = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/**
 * Variant B 히어로 — 텍스트 전용(마네킹 제거, ADR-018 개정).
 * 우측 빈 공간에 IF 로고 인트로(HeroLogoIntro)가 먼저 조립된 뒤(~0.9s) 좌측 텍스트가 공개된다.
 * 좌측 컬럼은 항상 마운트(opacity gate) — SSR/aria/SEO 보존. reduced-motion이면 즉시 노출.
 */
export function Hero() {
  const [reduced, setReduced] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const r = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(r);
    if (r) {
      setRevealed(true);
      return;
    }
    const t = setTimeout(() => setRevealed(true), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="bg-b-hero relative flex min-h-[100svh] items-center overflow-hidden px-6 py-[clamp(72px,9vh,112px)] md:px-gutter">
      <div className="relative z-10 mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-10 md:grid-cols-[1fr_auto] md:gap-16">
        <motion.div
          initial="hidden"
          animate={revealed ? "show" : "hidden"}
          variants={LEFT_CONTAINER}
          className="max-w-[62ch]"
        >
          <motion.p
            variants={LEFT_ITEM}
            className="text-t7 font-extrabold uppercase tracking-[0.24em] text-b-accent"
          >
            Intelligent Fashion
          </motion.p>
          <motion.h1
            variants={LEFT_ITEM}
            aria-label="Wear what you imagine"
            className="mt-3 text-[clamp(40px,6.4vw,84px)] font-extrabold uppercase leading-[0.9] tracking-[-0.03em] text-b-light"
          >
            <RevealWords text="Wear what you imagine" />
          </motion.h1>
          <motion.div variants={LEFT_ITEM}>
            <CoralUnderline className="mt-5 w-[clamp(80px,14vw,160px)]" />
          </motion.div>
          <motion.p
            variants={LEFT_ITEM}
            className="mt-5 max-w-[36ch] text-t5 text-b-light/70 [word-break:keep-all] [text-wrap:balance]"
          >
            한 문장이면 충분해요. 상상한 룩을 만들고, 입을 수 있는 상품으로 잇습니다.
          </motion.p>
          <motion.div variants={LEFT_ITEM} className="mt-7">
            <Link
              href="/studio"
              className="b-glow inline-flex min-h-[56px] items-center rounded-full bg-b-accent px-8 text-t6 font-extrabold uppercase tracking-[0.12em] text-b-ink transition-transform duration-300 hover:-translate-y-0.5"
            >
              스튜디오 시작
            </Link>
          </motion.div>
        </motion.div>

        <div className="hidden md:block">
          <HeroLogoIntro reduced={reduced} />
        </div>
      </div>
    </section>
  );
}
