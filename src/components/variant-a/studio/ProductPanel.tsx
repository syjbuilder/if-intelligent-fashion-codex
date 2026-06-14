"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { ProductMock } from "@/types/ui";

const won = (n: number) => `₩${n.toLocaleString("ko-KR")}`;

/**
 * 상세 우측 상품 패널 — "상품 보기" 후 우측에서 슬라이드 인(x:100%→0).
 * 각 상품은 외부 몰 링크(target=_blank rel=noopener, ADR-004 자체 결제 X) + 이미지/폴백.
 */
export function ProductPanel({
  open,
  products,
  onClose,
}: {
  open: boolean;
  products: ProductMock[];
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ x: "100%", opacity: 0.4 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0.4 }}
          transition={{ type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
          aria-label="이 룩의 상품"
          className="fixed right-0 top-0 z-[160] flex h-full w-[min(420px,92vw)] flex-col bg-paper shadow-[0_0_60px_rgba(26,26,26,0.25)] md:w-[380px]"
        >
          <header className="flex items-center justify-between border-b border-line px-6 py-5">
            <div>
              <p className="text-t8 font-extrabold uppercase tracking-[0.18em] text-accent">
                This look
              </p>
              <h3 className="mt-1 text-t4 font-extrabold text-ink">
                구성 상품 {products.length}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink transition-colors hover:bg-cream"
            >
              ×
            </button>
          </header>

          <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
            {products.map((p) => (
              <li key={p.id}>
                <a
                  href={p.url ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 py-4 transition-opacity hover:opacity-70"
                >
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-[6px] bg-cream">
                    {p.imageSrc ? (
                      <Image
                        src={p.imageSrc}
                        alt={p.name}
                        fill
                        sizes="64px"
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
                </a>
              </li>
            ))}
          </ul>

          <p className="border-t border-line px-6 py-4 text-[11px] leading-relaxed text-slate-body">
            각 상품은 외부 온라인몰에서 구매합니다. I.F는 자체 결제를 제공하지 않아요.
          </p>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
