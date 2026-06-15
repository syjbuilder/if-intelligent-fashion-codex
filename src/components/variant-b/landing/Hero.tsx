"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { RevealWords } from "@/components/motion/RevealWords";
import { CoralUnderline } from "@/components/motion/CoralUnderline";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Variant B 히어로 — 텍스트 전용(마네킹 이미지 제거, ADR-018 개정).
 * 키네틱 타이포(RevealWords 헤드라인 + CoralUnderline)가 첫 화면의 감각 역할을 대체한다.
 * bg-b-hero 코랄 글로우 배경 유지. 1화면 핏(헤드라인 축소 + 패딩 축소).
 */
export function Hero() {
  return (
    <section className="bg-b-hero relative flex min-h-[100svh] items-center overflow-hidden px-6 py-[clamp(72px,9vh,112px)] md:px-gutter">
      <div className="relative z-10 max-w-[62ch]">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-t7 font-extrabold uppercase tracking-[0.24em] text-b-accent"
        >
          Intelligent Fashion
        </motion.p>
        <h1
          aria-label="Wear what you imagine"
          className="mt-3 text-[clamp(40px,6.4vw,84px)] font-extrabold uppercase leading-[0.9] tracking-[-0.03em] text-b-light"
        >
          <RevealWords text="Wear what you imagine" />
        </h1>
        <CoralUnderline className="mt-5 w-[clamp(80px,14vw,160px)]" />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="mt-5 max-w-[40ch] text-t5 text-b-light/70"
        >
          한 문장이면 충분해요. 상상한 룩을 만들고, 입을 수 있는 상품으로 잇습니다.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.32, ease: EASE }}
          className="mt-7"
        >
          <Link
            href="/studio"
            className="b-glow inline-flex min-h-[56px] items-center rounded-full bg-b-accent px-8 text-t6 font-extrabold uppercase tracking-[0.12em] text-b-ink transition-transform duration-300 hover:-translate-y-0.5"
          >
            스튜디오 시작
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
