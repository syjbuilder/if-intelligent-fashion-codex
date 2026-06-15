"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CURATED_LOOKS } from "@/lib/looks-fixtures";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Variant B 큐레이션 — 다크 면 위 가로 룩 레일. trionn "+" 코너 + 코랄 + whileInView stagger.
 * 베이스라인의 세로 100svh 큐레이션과 다른 구조(다크 풀폭 레일 + 큰 콘덴스드 헤더).
 */
export function CuratedRail() {
  return (
    <section className="bg-b-ink px-6 py-24 md:px-gutter">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-t7 font-extrabold uppercase tracking-[0.24em] text-b-accent">
              Today&apos;s curated
            </p>
            <h2 className="mt-3 text-[clamp(32px,5vw,64px)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em] text-b-light">
              Six ways
              <br />
              to begin
            </h2>
          </div>
          <Link
            href="/b/studio"
            className="hidden shrink-0 text-t7 font-extrabold uppercase tracking-[0.14em] text-b-light/70 transition-colors hover:text-b-accent md:block"
          >
            스튜디오 →
          </Link>
        </div>

        <div className="-mx-6 mt-12 overflow-x-auto px-6 md:-mx-gutter md:px-gutter">
          <div className="flex w-max snap-x snap-mandatory gap-4 pb-3">
            {CURATED_LOOKS.map((l, i) => (
              <motion.article
                key={l.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
                className="group relative w-[clamp(240px,24vw,320px)] shrink-0 snap-start overflow-hidden rounded-[2px] bg-b-surface"
              >
                <div className="relative aspect-[3/4]">
                  {l.imageSrc && (
                    <Image
                      src={l.imageSrc}
                      alt={l.caption}
                      fill
                      sizes="320px"
                      className="object-cover transition-transform duration-700 ease-expo group-hover:scale-[1.05]"
                    />
                  )}
                  <span aria-hidden className="absolute left-3 top-3 font-bold text-b-accent">
                    +
                  </span>
                  <span aria-hidden className="absolute right-3 top-3 font-bold text-b-accent">
                    +
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 px-4 py-3">
                  <span className="text-t8 font-extrabold uppercase tracking-[0.14em] text-b-light">
                    {l.tag}
                  </span>
                  <span className="truncate text-[11px] text-b-light/55">
                    {l.caption}
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
