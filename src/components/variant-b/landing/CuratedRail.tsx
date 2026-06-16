"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { RevealWords } from "@/components/motion/RevealWords";
import { CURATED_LOOKS } from "@/lib/looks-fixtures";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Variant B 큐레이션 — magnific식 균일 3×2 이미지 그리드 + trionn 키네틱.
 * 카드: 풀블리드 이미지 + 하단 그라디언트 스크림 + 하단 텍스트 + "+" 코너 + 호버 코랄 라인 드로우.
 * 기존 가로 스크롤 레일 폐기(디자인 품질 개선). whileInView stagger.
 */
export function CuratedRail() {
  return (
    <section className="bg-b-ink px-6 py-24 md:px-gutter">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-t7 font-extrabold uppercase tracking-[0.24em] text-b-accent">
              How it works
            </p>
            <h2
              aria-label="Ways to begin"
              className="mt-3 text-[clamp(32px,5vw,64px)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em] text-b-light"
            >
              <RevealWords text="Ways to begin" />
            </h2>
          </div>
          <Link
            href="/studio"
            className="shrink-0 rounded-full border border-b-line bg-b-surface/60 px-4 py-2 text-t7 font-extrabold uppercase tracking-[0.14em] text-b-accent backdrop-blur transition-colors hover:bg-b-surface"
          >
            스튜디오 →
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CURATED_LOOKS.map((l, i) => (
            <motion.article
              key={l.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.06, ease: EASE }}
              className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-[8px] bg-b-surface p-6"
            >
              {l.imageSrc && (
                <Image
                  src={l.imageSrc}
                  alt={l.caption}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="absolute inset-0 object-cover transition-transform duration-700 ease-expo group-hover:scale-[1.05]"
                />
              )}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
              />
              <span aria-hidden className="absolute left-3 top-3 font-bold text-b-accent">
                +
              </span>
              <span aria-hidden className="absolute right-3 top-3 font-bold text-b-accent">
                +
              </span>
              <span
                aria-hidden
                className="absolute bottom-[64px] left-6 h-[2px] w-10 origin-left scale-x-0 bg-b-accent transition-transform duration-500 ease-expo group-hover:scale-x-100"
              />
              <div className="relative">
                <span className="text-t8 font-extrabold uppercase tracking-[0.14em] text-b-light">
                  {l.tag}
                </span>
                <p className="mt-1 text-t6 text-b-light/75">{l.caption}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
