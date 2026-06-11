"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { HERO_LOOKS, HERO_ROTATE_MS } from "@/lib/hero-looks";

/**
 * 히어로 좌측 마네킹 룩 로테이션 레이어. 7장 crossfade 스택을 깔고
 * HERO_ROTATE_MS마다 다음 장으로 — 전환 모션(rotateY+scale)은 globals의
 * .hero-figure-img가 담당한다. 장식 레이어라 aria-hidden, 클릭 불가.
 * prefers-reduced-motion이면 첫 장 고정, 탭이 숨겨지면 인터벌을 멈춘다.
 */
export function HeroFigure() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let id: ReturnType<typeof setInterval> | null = null;
    const start = () => {
      if (id !== null) return;
      id = setInterval(
        () => setActive((i) => (i + 1) % HERO_LOOKS.length),
        HERO_ROTATE_MS,
      );
    };
    const stop = () => {
      if (id !== null) {
        clearInterval(id);
        id = null;
      }
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="hero-figure" aria-hidden>
      {HERO_LOOKS.map((look, i) => (
        <div
          key={look.src}
          className={`hero-figure-img ${i === active ? "is-active" : ""}`}
        >
          <Image
            src={look.src}
            alt=""
            fill
            priority={i === 0}
            sizes="(max-width: 900px) 100vw, 42vw"
            className="object-cover object-top"
          />
        </div>
      ))}
    </div>
  );
}
