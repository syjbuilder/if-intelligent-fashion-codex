"use client";

import { Fragment } from "react";
import { useReveal, splitWords } from "./useReveal";

/**
 * 키네틱 타이포 — 텍스트를 단어 단위로 분해해 진입 시 아래에서 올라오는 stagger reveal.
 * 장식이므로 `aria-hidden`. **소비하는 헤딩이 `aria-label`로 접근명을 보존**해야 한다
 * (예: `<h1 aria-label="Style your Imagination."><RevealWords text="Style your Imagination." /></h1>`)
 * → 스크린리더·`getByRole('heading',{name})` 테스트가 그대로 동작.
 */
export function RevealWords({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const { ref, visible } = useReveal<HTMLSpanElement>();
  const words = splitWords(text);

  return (
    <span
      ref={ref}
      aria-hidden
      className={`reveal-words ${visible ? "in-view" : ""} ${className}`}
    >
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="rw-word">
            <span className="rw-inner" style={{ transitionDelay: `${i * 60}ms` }}>
              {w}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}
