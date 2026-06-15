"use client";

import Image from "next/image";
import type { ProductMock } from "@/types/ui";

const won = (n: number) => `₩${n.toLocaleString("ko-KR")}`;

/** Variant B 상품 리스트 — 다크 인라인 상시 노출, 코랄 가격, 외부 링크(rel=noopener, ADR-004). */
export function ProductPanel({
  products,
  className = "",
}: {
  products: ProductMock[];
  className?: string;
}) {
  return (
    <ul className={`divide-y divide-b-line ${className}`}>
      {products.map((p) => (
        <li key={p.id}>
          <a
            href={p.url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 py-3.5 transition-opacity hover:opacity-70"
          >
            <div className="relative h-[72px] w-[58px] shrink-0 overflow-hidden rounded-[2px] bg-b-ink">
              {p.imageSrc ? (
                <Image src={p.imageSrc} alt={p.name} fill sizes="58px" className="object-cover" />
              ) : (
                <span className="grid h-full w-full place-items-center text-[10px] uppercase text-b-light/40">
                  {p.category}
                </span>
              )}
            </div>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-t6 font-semibold text-b-light">
                {p.name}
              </span>
              <span className="block text-[11px] text-b-light/45">
                {p.brand} · {p.platform}
              </span>
              <span className="mt-1 block text-t6 font-extrabold text-b-accent">
                {won(p.price)}
              </span>
            </span>
            <span aria-hidden className="shrink-0 text-b-light/50">
              →
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
