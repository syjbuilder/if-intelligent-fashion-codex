"use client";

import { useEffect, useRef, useState } from "react";

/** reveal-words용 — 문장을 단어 배열로 분해(공백 기준) */
export function splitWords(text: string): string[] {
  return text.trim().split(/\s+/);
}

/**
 * 진입 모션 훅 — 요소가 뷰포트에 들어오면 visible=true.
 * prefers-reduced-motion이거나 IntersectionObserver 미지원이면 즉시 visible(접근성/SSR 안전).
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit,
) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      options ?? { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return { ref, visible };
}
