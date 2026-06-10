"use client";

import { GarmentSvg } from "@/components/looks/GarmentSvg";
import { Chip } from "@/components/ui/Chip";
import type { LookTone } from "@/types/ui";

type ResultProduct = { name: string; brand: string; price: number };

export const RESULT_LOOKS: {
  tone: LookTone;
  tag: string;
  title: string;
  products: ResultProduct[];
}[] = [
  {
    tone: "office",
    tag: "OFFICE",
    title: "뉴트럴 테일러드 셋업",
    products: [
      { name: "싱글 테일러드 블레이저", brand: "29CM 셀렉트", price: 89000 },
      { name: "와이드 트라우저", brand: "무신사 스탠다드", price: 49000 },
      { name: "코튼 오버핏 셔츠", brand: "에이블리", price: 39000 },
    ],
  },
  {
    tone: "date",
    tag: "DATE",
    title: "러블리 미디 원피스",
    products: [
      { name: "새틴 미디 원피스", brand: "지그재그", price: 59000 },
      { name: "크롭 니트 가디건", brand: "29CM", price: 45000 },
      { name: "스트랩 슈즈", brand: "네이버쇼핑", price: 69000 },
    ],
  },
  {
    tone: "sport",
    tag: "SPORT",
    title: "애슬레저 캐주얼",
    products: [
      { name: "오버핏 후디", brand: "무신사", price: 42000 },
      { name: "테크 조거 팬츠", brand: "에이블리", price: 38000 },
      { name: "러너 스니커즈", brand: "29CM", price: 79000 },
    ],
  },
];

const REFINE_CHIPS = ["더 캐주얼하게", "색 바꾸기", "가격대 낮추기"];
const won = (n: number) => `₩${n.toLocaleString("ko-KR")}`;

/**
 * 결과 — 룩 plate 3장이 **한 화면에 핏**(데스크톱). **카드 위 hover 상품 오버레이**(트랙 B 반영):
 * 룩에 마우스를 올리면 그 위로 다크 글래스 + "This look · N pieces" + 상품 리스트 + Buy the look(aria-disabled).
 * mini-action 3패턴(ADR-009): 다시 생성 / 정제 칩 / 이런 스타일 더 + 상품 보기(ProductDrawer). 외부 구매 0(ADR-004).
 */
export function ResultsScene({
  onOpenDrawer,
  onRegenerate,
  onRefine,
  onMoreLike,
}: {
  onOpenDrawer?: () => void;
  onRegenerate?: () => void;
  onRefine?: (chip: string) => void;
  onMoreLike?: () => void;
}) {
  return (
    <section className="flex min-h-[100svh] flex-col bg-paper px-6 pb-6 pt-[88px] sm:h-[100svh] sm:min-h-0">
      <div className="mx-auto flex w-full max-w-[1320px] flex-1 flex-col sm:min-h-0">
        <div className="mb-4 shrink-0">
          <p className="text-t8 font-extrabold uppercase tracking-[0.18em] text-muted">
            Your looks
          </p>
          <h2 className="mt-1 text-t3 font-extrabold text-ink">
            세 가지 방향, 모두 입을 수 있게.
          </h2>
        </div>

        {/* 룩 plate 3장 — 데스크톱은 flex-1로 화면 핏, 모바일은 stack(스크롤) */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:flex-1 sm:min-h-0">
          {RESULT_LOOKS.map((l, i) => (
            <div
              key={l.tag}
              className={`tone-${l.tone} group relative aspect-[3/4] overflow-hidden rounded-card sm:aspect-auto`}
            >
              <GarmentSvg
                tone={l.tone}
                className="absolute inset-0 h-full w-full p-10 transition-transform duration-700 ease-expo group-hover:scale-[1.04]"
              />
              <span className="absolute right-3 top-3 z-10 text-[13px] font-extrabold opacity-55">
                0{i + 1}
              </span>
              <div className="absolute bottom-3 left-3.5 z-10">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] opacity-70">
                  Look 0{i + 1} · {l.tag}
                </p>
                <p className="mt-0.5 text-t5 font-semibold">{l.title}</p>
              </div>

              {/* 카드 위 상품 오버레이 (hover/focus 시) */}
              <div className="absolute inset-0 z-20 flex flex-col justify-end bg-[rgba(10,10,14,0.74)] p-4 text-white-soft opacity-0 backdrop-blur-[6px] transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-accent">
                  This look · {l.products.length} pieces
                </p>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {l.products.map((p) => (
                    <li
                      key={p.name}
                      className="flex items-baseline justify-between gap-2 border-b border-white/10 pb-2"
                    >
                      <span>
                        <span className="text-t6 font-medium">{p.name}</span>
                        <span className="block text-[10px] text-white-soft/50">
                          {p.brand}
                        </span>
                      </span>
                      <span className="shrink-0 text-t6 font-semibold">
                        {won(p.price)}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  aria-disabled="true"
                  title="각 상품은 외부 온라인몰에서 구매 · 자체 결제 없음"
                  className="mt-4 cursor-not-allowed self-start rounded-full border border-white/20 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white-soft/80"
                >
                  Buy the look →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* mini-action 바 */}
        <div className="mt-4 flex shrink-0 flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-2">
            {REFINE_CHIPS.map((c) => (
              <Chip key={c} variant="refine" onClick={() => onRefine?.(c)}>
                {c}
              </Chip>
            ))}
          </div>
          <div className="ml-auto flex gap-2 text-t7 font-extrabold uppercase tracking-[0.1em]">
            <button
              type="button"
              onClick={onRegenerate}
              className="rounded-full border border-ink/20 px-4 py-2 text-ink transition-colors hover:bg-cream"
            >
              다시 생성
            </button>
            <button
              type="button"
              onClick={onMoreLike}
              className="rounded-full border border-ink/20 px-4 py-2 text-ink transition-colors hover:bg-cream"
            >
              이런 스타일 더
            </button>
            <button
              type="button"
              onClick={onOpenDrawer}
              className="rounded-full bg-ink px-4 py-2 text-white-soft transition-colors hover:bg-[#2a2520]"
            >
              상품 보기
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
