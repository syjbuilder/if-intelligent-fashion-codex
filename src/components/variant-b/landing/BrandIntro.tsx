"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BrandMark } from "@/components/brand/BrandMark";

const KEY = "if:brandIntro:v1";
const EASE = [0.16, 1, 0.3, 1] as const;
const HOLD_MS = 1100; // 진입 시퀀스 후 자동 exit까지 홀드
const EXIT_MS = 700; // 위로 와이프 길이

type Phase = "boot" | "play" | "exit" | "done";

const CORNER = {
  hidden: { opacity: 0, scale: 0.6 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE } },
};
const MARK = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/**
 * Variant B 브랜드 인트로 — trionn식 블루프린트 리빌(로고+코랄 "+" 코너 등장 → 위로 와이프).
 * 세션 1회(sessionStorage), reduced-motion 스킵, body 스크롤 잠금, Esc/클릭/Skip 건너뛰기.
 * 하이드레이션 안전: boot/done은 null 렌더(서버=첫 클라 페인트 일치), 표시 결정은 마운트 후 effect에서만.
 */
export function BrandIntro({ onComplete }: { onComplete?: () => void }) {
  const [phase, setPhase] = useState<Phase>("boot");
  const holdRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // 표시 결정은 클라 마운트 후에만 (SSR=boot=null → mismatch 0)
  useEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(KEY) === "1";
    } catch {
      seen = false;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) {
      try {
        window.sessionStorage.setItem(KEY, "1");
      } catch {
        /* sessionStorage 비가용 — 무시 */
      }
      setPhase("done");
      return;
    }
    setPhase("play");
  }, []);

  // body 스크롤 잠금 (play·exit 동안)
  useEffect(() => {
    if (phase !== "play" && phase !== "exit") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [phase]);

  // play 진입 → 홀드 후 자동 exit
  useEffect(() => {
    if (phase !== "play") return;
    holdRef.current = setTimeout(() => setPhase("exit"), HOLD_MS);
    return () => clearTimeout(holdRef.current);
  }, [phase]);

  const finish = useCallback(() => {
    try {
      window.sessionStorage.setItem(KEY, "1");
    } catch {
      /* 무시 */
    }
    setPhase("done");
    onComplete?.();
  }, [onComplete]);

  // exit 진입 → 와이프 길이 후 종료
  useEffect(() => {
    if (phase !== "exit") return;
    const t = setTimeout(finish, EXIT_MS);
    return () => clearTimeout(t);
  }, [phase, finish]);

  const skip = useCallback(() => {
    if (holdRef.current) clearTimeout(holdRef.current);
    setPhase("exit");
  }, []);

  // Esc 건너뛰기
  useEffect(() => {
    if (phase !== "play" && phase !== "exit") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, skip]);

  if (phase === "boot" || phase === "done") return null;

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="브랜드 인트로"
      onClick={skip}
      className="fixed inset-0 z-[300] flex items-center justify-center bg-b-ink"
      initial={{ clipPath: "inset(0 0 0% 0)" }}
      animate={{ clipPath: phase === "exit" ? "inset(0 0 100% 0)" : "inset(0 0 0% 0)" }}
      transition={{ duration: EXIT_MS / 1000, ease: EASE }}
    >
      <button
        type="button"
        aria-label="인트로 건너뛰기"
        onClick={(e) => {
          e.stopPropagation();
          skip();
        }}
        className="absolute right-6 top-6 text-t7 font-extrabold uppercase tracking-[0.18em] text-b-light/60 transition-colors hover:text-b-accent"
      >
        Skip
      </button>
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
        className="relative grid place-items-center p-12"
      >
        <motion.span aria-hidden variants={CORNER} className="absolute left-0 top-0 font-bold text-b-accent">
          +
        </motion.span>
        <motion.span aria-hidden variants={CORNER} className="absolute right-0 top-0 font-bold text-b-accent">
          +
        </motion.span>
        <motion.span aria-hidden variants={CORNER} className="absolute bottom-0 left-0 font-bold text-b-accent">
          +
        </motion.span>
        <motion.span aria-hidden variants={CORNER} className="absolute bottom-0 right-0 font-bold text-b-accent">
          +
        </motion.span>
        <motion.div variants={MARK}>
          <BrandMark className="text-b-light" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
