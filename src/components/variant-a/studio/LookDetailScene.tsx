"use client";

import { Chip } from "@/components/ui/Chip";
import type { LookCardData, ProductMock } from "@/types/ui";
import { LookDetailFigure } from "./LookDetailFigure";
import { ProductPanel } from "./ProductPanel";

const REFINE_CHIPS = ["더 캐주얼하게", "색 바꾸기", "가격대 낮추기"];

/**
 * Variant A 룩 상세 — 한 화면 핏(데스크톱 스크롤 없음).
 * 좌: 확대 룩(layoutId morph, 컬럼 높이 채움). 우: 헤딩(t3) + compact mini-action + **상품 즉시 노출**.
 * 프롬프트 도크는 이 화면에서 표시 안 함(페이지가 detail에서 도크 숨김 → 상품 가시성 우선).
 */
export function LookDetailScene({
  look,
  products,
  onBack,
  onRegenerate,
  onMoreLike,
  onRefine,
}: {
  look: LookCardData;
  products: ProductMock[];
  onBack?: () => void;
  onRegenerate?: () => void;
  onMoreLike?: () => void;
  onRefine?: (chip: string) => void;
}) {
  return (
    <section className="mx-auto flex min-h-[100svh] w-full max-w-[1320px] flex-col px-6 pb-6 pt-[76px] md:px-gutter lg:h-[100svh]">
      <button
        type="button"
        onClick={onBack}
        className="shrink-0 self-start text-t7 font-extrabold uppercase tracking-[0.12em] text-ink-soft transition-opacity hover:opacity-60"
      >
        ← 결과로
      </button>

      <div className="mt-3 grid min-h-0 flex-1 gap-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1fr)]">
        {/* 좌: 확대 룩 (모바일 3/4, 데스크톱 컬럼 높이 채움) */}
        <LookDetailFigure
          look={look}
          className="aspect-[3/4] lg:aspect-auto lg:h-full"
        />

        {/* 우: 정보 + 상품 즉시 */}
        <div className="flex min-h-0 flex-col">
          <p className="text-t8 font-extrabold uppercase tracking-[0.18em] text-accent">
            This look
          </p>
          <h2 className="mt-1 text-t3 font-extrabold text-ink">{look.caption}</h2>

          {/* compact mini-action 1행 (ADR-009) */}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onRegenerate}
              className="rounded-full border border-ink/20 px-3.5 py-1.5 text-t8 font-extrabold uppercase tracking-[0.1em] text-ink transition-colors hover:bg-cream"
            >
              다시 생성
            </button>
            <button
              type="button"
              onClick={onMoreLike}
              className="rounded-full border border-ink/20 px-3.5 py-1.5 text-t8 font-extrabold uppercase tracking-[0.1em] text-ink transition-colors hover:bg-cream"
            >
              이런 스타일 더
            </button>
            {REFINE_CHIPS.map((c) => (
              <Chip key={c} variant="refine" onClick={() => onRefine?.(c)}>
                {c}
              </Chip>
            ))}
          </div>

          {/* 상품 — 바로 보임, 컬럼 내부 스크롤 */}
          <p className="mt-5 shrink-0 text-t8 font-extrabold uppercase tracking-[0.16em] text-muted">
            구성 상품 {products.length}
          </p>
          <ProductPanel
            products={products}
            className="mt-1 min-h-0 flex-1 overflow-y-auto pr-1"
          />
        </div>
      </div>
    </section>
  );
}
