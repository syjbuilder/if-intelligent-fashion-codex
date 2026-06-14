"use client";

import { useState } from "react";
import { Chip } from "@/components/ui/Chip";
import type { LookCardData, ProductMock } from "@/types/ui";
import { LookDetailFigure } from "./LookDetailFigure";
import { ProductPanel } from "./ProductPanel";

const REFINE_CHIPS = ["더 캐주얼하게", "색 바꾸기", "가격대 낮추기"];

/**
 * Variant A 룩 상세 — 좌측 확대 룩(layoutId morph) + 우측 "상품 보기" 슬라이드 패널(2단계).
 * 진입 시 ProductPanel은 닫힘; "상품 보기"를 눌러야 우측에서 등장.
 * mini-action 가이드 행(다시 생성 / 이런 스타일 더 / 정제 칩 — ADR-009)은 좌하단에.
 * 프롬프트 입력 지속은 페이지 레벨 고정 도크가 담당(이전 프롬프트 prefill).
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
  const [productsOpen, setProductsOpen] = useState(false);

  return (
    <section className="mx-auto w-full max-w-[1320px] px-6 pb-40 pt-[88px] md:px-gutter">
      <button
        type="button"
        onClick={onBack}
        className="text-t7 font-extrabold uppercase tracking-[0.12em] text-ink-soft transition-opacity hover:opacity-60"
      >
        ← 결과로
      </button>

      <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* 좌: 확대 룩 */}
        <div className="lg:max-w-[480px]">
          <LookDetailFigure look={look} />
        </div>

        {/* 우: 정보 + 액션 */}
        <div className="flex flex-col">
          <p className="text-t8 font-extrabold uppercase tracking-[0.18em] text-accent">
            This look
          </p>
          <h2 className="mt-2 text-t2 font-extrabold text-ink">{look.caption}</h2>
          <p className="mt-3 max-w-[44ch] text-t5 text-ink-soft">
            마음에 들면 구성 상품을 확인하고, 원하는 방향으로 다듬어 보세요.
          </p>

          {/* mini-action 가이드 행 */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onRegenerate}
              className="rounded-full border border-ink/20 px-4 py-2 text-t7 font-extrabold uppercase tracking-[0.1em] text-ink transition-colors hover:bg-cream"
            >
              다시 생성
            </button>
            <button
              type="button"
              onClick={onMoreLike}
              className="rounded-full border border-ink/20 px-4 py-2 text-t7 font-extrabold uppercase tracking-[0.1em] text-ink transition-colors hover:bg-cream"
            >
              이런 스타일 더
            </button>
            {REFINE_CHIPS.map((c) => (
              <Chip key={c} variant="refine" onClick={() => onRefine?.(c)}>
                {c}
              </Chip>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setProductsOpen((v) => !v)}
            className="mt-7 self-start rounded-full bg-ink px-7 py-3 text-t6 font-extrabold uppercase tracking-[0.12em] text-white-soft transition-transform duration-300 hover:-translate-y-0.5"
          >
            상품 보기
          </button>
        </div>
      </div>

      <ProductPanel
        open={productsOpen}
        products={products}
        onClose={() => setProductsOpen(false)}
      />
    </section>
  );
}
