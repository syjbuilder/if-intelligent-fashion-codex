"use client";

import type { LookCardData } from "@/types/ui";
import { GarmentSvg } from "./GarmentSvg";

/**
 * 룩 카드 — aspect 3/4, tone 그라디언트 면 + 가먼트 SVG + 좌하 tag + 우하 캡션.
 * curated/explore/saved/gate 공통 재사용. 클릭 시 onClick(look)(프롬프트 자동입력은 다음 phase에서 wired).
 * 텍스트(캡션)는 이미지보다 강조하지 않는다(UI_GUIDE 안티패턴).
 */
export function LookCard({
  look,
  onClick,
  className = "",
}: {
  look: LookCardData;
  onClick?: (look: LookCardData) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(look)}
      className={`group relative block aspect-[3/4] w-full overflow-hidden rounded-card text-left transition-[filter] duration-500 hover:brightness-[1.04] tone-${look.tone} ${className}`}
    >
      <GarmentSvg
        tone={look.tone}
        className="absolute inset-0 h-full w-full p-7 opacity-90 transition-transform duration-700 ease-expo group-hover:scale-[1.05]"
      />
      <span className="absolute bottom-3 left-3 z-10 text-[10px] font-extrabold uppercase tracking-[0.14em]">
        {look.tag}
      </span>
      <span className="absolute bottom-3 right-3 z-10 max-w-[58%] text-right text-[10px] font-normal leading-tight opacity-70">
        {look.caption}
      </span>
    </button>
  );
}
