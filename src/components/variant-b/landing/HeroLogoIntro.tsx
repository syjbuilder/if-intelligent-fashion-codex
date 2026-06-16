"use client";

import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

// 다이아몬드 꼭지점: 상(50,8)·우(92,50)·하(50,92)·좌(8,50), 중앙(50,50).
// 외곽선은 상→우→하→좌 순서 = 상단 꼭지점에서 시계방향 연속 드로우.
const OUTLINE = "M50 8 L92 50 L50 92 L8 50 Z";
// 4개 베벨 면(중앙↔모서리) — 좌상 라이트 → 우하 다크(좌상 광원).
const FACETS = [
  { d: "M8 50 L50 8 L50 50 Z", fill: "#34293b" }, // 좌-상 (가장 라이트)
  { d: "M50 8 L92 50 L50 50 Z", fill: "#2a2230" }, // 상-우 (라이트)
  { d: "M8 50 L50 92 L50 50 Z", fill: "#1b1624" }, // 좌-하 (다크)
  { d: "M92 50 L50 92 L50 50 Z", fill: "#15111c" }, // 우-하 (가장 다크)
];

/**
 * 히어로 우측 인트로 — 45° 베벨 다이아몬드.
 * 외곽선이 상단 꼭지점에서 시계방향으로 두껍게 그려진 뒤, 3D facet 면(광/명암)이 차고,
 * 가운데 큰 IF가 등장. reduced면 최종 상태 즉시. 장식용(aria-hidden).
 */
export function HeroLogoIntro({ reduced = false }: { reduced?: boolean }) {
  return (
    <div
      data-hero-logo
      className="relative grid h-[clamp(220px,30vw,380px)] w-[clamp(220px,30vw,380px)] place-items-center"
    >
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        fill="none"
        className="absolute inset-0 h-full w-full overflow-visible"
        style={{ filter: "drop-shadow(0 24px 50px rgba(0,0,0,0.55))" }}
      >
        <defs>
          <radialGradient id="b-gem-glint" cx="38%" cy="30%" r="58%">
            <stop offset="0%" stopColor="rgba(246,105,80,0.55)" />
            <stop offset="60%" stopColor="rgba(246,105,80,0)" />
          </radialGradient>
        </defs>
        {/* 3D 베벨 면 + 좌상 코랄 글린트 */}
        <motion.g
          initial={reduced ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: reduced ? 0 : 0.45, ease: EASE }}
        >
          {FACETS.map((f) => (
            <path key={f.d} d={f.d} fill={f.fill} />
          ))}
          <path d={OUTLINE} fill="url(#b-gem-glint)" />
        </motion.g>
        {/* 외곽선 — 시계방향 두꺼운 선 드로우 */}
        <motion.path
          d={OUTLINE}
          stroke="#f66950"
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: EASE }}
          style={{ filter: "drop-shadow(0 0 8px rgba(246,105,80,0.6))" }}
        />
      </svg>
      {/* 가운데 큰 IF */}
      <motion.span
        initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: reduced ? 0 : 0.95, ease: EASE }}
        className="relative text-[clamp(44px,6.5vw,88px)] font-extrabold tracking-tightest text-b-light [text-shadow:0_2px_20px_rgba(0,0,0,0.65)]"
      >
        IF
      </motion.span>
    </div>
  );
}
