"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { HERO_LOOKS } from "@/lib/hero-looks";

const EASE = [0.16, 1, 0.3, 1] as const;

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
      className="bg-b-hero relative flex min-h-[100svh] items-center overflow-hidden px-6 md:px-gutter"
    >
      <motion.div
        style={{ y }}
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-full w-[clamp(280px,46vw,640px)]"
      >
        <Image
          src={HERO_LOOKS[3].src}
          alt=""
          fill
          priority
          sizes="46vw"
          className="object-cover object-top opacity-80 [mask-image:linear-gradient(to_left,black_50%,transparent)]"
        />
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
