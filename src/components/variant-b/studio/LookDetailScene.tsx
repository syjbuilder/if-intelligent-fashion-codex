"use client";

import type { LookCardData, ProductMock } from "@/types/ui";
import { LookDetailFigure } from "./LookDetailFigure";
import { ProductPanel } from "./ProductPanel";

const REFINE = ["더 캐주얼하게", "색 바꾸기", "가격대 낮추기"];

/**
 * Variant B 룩 상세 — A 상세 피드백을 처음부터 반영: 한 화면 핏 · 상품 즉시 인라인 ·
 * 프롬프트 도크 없음(페이지가 detail에서 숨김) · 헤딩 t3. 다크+코랄.
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
    <section className="mx-auto flex min-h-[100svh] w-full max-w-[1320px] flex-col px-6 pb-6 pt-[84px] md:px-gutter lg:h-[100svh]">
      <button
        type="button"
        onClick={onBack}
        className="shrink-0 self-start text-t7 font-extrabold uppercase tracking-[0.12em] text-b-light/60 transition-colors hover:text-b-accent"
      >
        ← 결과로
      </button>

      <div className="mt-3 grid min-h-0 flex-1 gap-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1fr)]">
        <LookDetailFigure
          look={look}
          className="aspect-[3/4] lg:aspect-auto lg:h-full"
        />

        <div className="flex min-h-0 flex-col">
          <p className="text-t8 font-extrabold uppercase tracking-[0.2em] text-b-accent">
            This look
          </p>
          <h2 className="mt-1 text-t3 font-extrabold text-b-light">{look.caption}</h2>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onRegenerate}
              className="rounded-full border border-b-line px-3.5 py-1.5 text-t8 font-extrabold uppercase tracking-[0.1em] text-b-light transition-colors hover:border-b-accent"
            >
              다시 생성
            </button>
            <button
              type="button"
              onClick={onMoreLike}
              className="rounded-full border border-b-line px-3.5 py-1.5 text-t8 font-extrabold uppercase tracking-[0.1em] text-b-light transition-colors hover:border-b-accent"
            >
              이런 스타일 더
            </button>
            {REFINE.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onRefine?.(c)}
                className="rounded-full border border-b-line px-3.5 py-1.5 text-t8 font-semibold text-b-light/80 transition-colors hover:border-b-accent hover:text-b-accent"
              >
                {c}
              </button>
            ))}
          </div>

          <p className="mt-5 shrink-0 text-t8 font-extrabold uppercase tracking-[0.16em] text-b-light/50">
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
