"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { HERO_LOOKS } from "@/lib/hero-looks";

const EASE = [0.16, 1, 0.3, 1] as const;

// FIX 3: 단일 정적 데일리 룩(06-feminine-smart-casual). 회전 없음 — blur/scrim 블렌드 합성과 충돌 방지.
const HERO_LOOK = HERO_LOOKS[5];

/**
 * Variant B 히어로 — 다크 base + 코랄 액센트 + 콘덴스드 임팩트 헤드라인 + 우측 마네킹 parallax.
 * trionn식 키네틱(useScroll parallax) + magnific 여백/글로우. 베이스라인(중앙 텍스트+좌 회전)과 구조적으로 다름.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);

  return (
    <section
      ref={ref}
      className="bg-b-hero relative flex min-h-[100svh] items-center overflow-hidden px-6 py-[clamp(104px,14vh,176px)] md:px-gutter"
    >
      <motion.div
        style={{ y }}
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-full w-[clamp(280px,46vw,640px)]"
      >
        {/* 블러 bleed — 동일 webp 확대·블러·저투명도로 실루엣을 b-ink에 번지게 (네트워크 추가 0) */}
        <Image
          src={HERO_LOOK.src}
          alt=""
          fill
          aria-hidden
          sizes="46vw"
          className="scale-110 object-cover object-top opacity-40 blur-2xl"
        />
        {/* 선명한 전경 — 라디얼 다면 마스크(.b-hero-fg)로 좌·상·하를 동시 페이드해 가장자리를 배경에 녹임 */}
        <Image
          src={HERO_LOOK.src}
          alt=""
          fill
          priority
          sizes="46vw"
          className="b-hero-fg object-cover object-top opacity-80"
        />
        {/* 코랄 틴트 + 하단/좌측 b-ink 디졸브 scrim */}
        <div className="b-hero-scrim absolute inset-0" />
      </motion.div>

      <div className="relative z-10 max-w-[62ch]">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-t7 font-extrabold uppercase tracking-[0.24em] text-b-accent"
        >
          Intelligent Fashion
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
          className="mt-4 text-[clamp(52px,9vw,128px)] font-extrabold uppercase leading-[0.9] tracking-[-0.03em] text-b-light"
        >
          Wear what
          <br />
          you <span className="text-b-accent">imagine</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="mt-6 max-w-[40ch] text-t5 text-b-light/70"
        >
          한 문장이면 충분해요. 상상한 룩을 만들고, 입을 수 있는 상품으로 잇습니다.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.32, ease: EASE }}
          className="mt-9"
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
