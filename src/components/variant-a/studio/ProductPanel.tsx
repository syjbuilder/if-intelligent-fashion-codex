"use client";

import Image from "next/image";
import type { ProductMock } from "@/types/ui";

const won = (n: number) => `₩${n.toLocaleString("ko-KR")}`;

/**
 * 상세 우측 상품 리스트 — 인라인 상시 노출(슬라이드/토글 없음, depth 축소).
 * 각 상품은 외부 몰 링크(target=_blank rel=noopener, ADR-004 자체 결제 X) + 이미지/폴백.
 * 높이는 부모가 제어(컬럼 내부 스크롤).
 */
export function ProductPanel({
  products,
  className = "",
}: {
  products: ProductMock[];
  className?: string;
}) {
  return (
    <ul className={`divide-y divide-line ${className}`}>
      {products.map((p) => (
        <li key={p.id}>
          <a
            href={p.url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 py-3.5 transition-opacity hover:opacity-70"
          >
            <div className="relative h-[72px] w-[58px] shrink-0 overflow-hidden rounded-[6px] bg-cream">
              {p.imageSrc ? (
                <Image
                  src={p.imageSrc}
                  alt={p.name}
                  fill
                  sizes="58px"
                  className="object-cover"
                />
              ) : (
                <span className="grid h-full w-full place-items-center text-[10px] uppercase text-muted">
                  {p.category}
                </span>
              )}
            </div>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-t6 font-semibold text-ink">
                {p.name}
              </span>
              <span className="block text-[11px] text-slate-body">
                {p.brand} · {p.platform}
              </span>
              <span className="mt-1 block text-t6 font-extrabold text-ink">
                {won(p.price)}
              </span>
            </span>
            <span aria-hidden className="shrink-0 text-ink-soft">
              →
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
