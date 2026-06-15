"use client";

import { LookCard } from "@/components/looks/LookCard";
import { GarmentSvg } from "@/components/looks/GarmentSvg";
import { Cta } from "@/components/ui/Cta";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { LookCardData, LookTone } from "@/types/ui";

/**
 * 저장한 룩 / 히스토리 오버레이. 3분기:
 * 비로그인 → 가입 유도 gate(blur preview + 로그인 CTA) / 로그인+저장0 → 빈 상태 / 로그인+저장>0 → saved-grid.
 * 빈 리스트를 그대로 보여주지 않는다(PRD AC).
 * tone: light(기본) / dark(Variant B — 다크+코랄). 기본값이라 A·현행은 무영향.
 */
export function HistoryOverlay({
  open,
  onClose,
  isLoggedIn,
  savedLooks = [],
  onSignIn,
  tone = "light",
}: {
  open: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  savedLooks?: LookCardData[];
  onSignIn?: () => void;
  tone?: "light" | "dark";
}) {
  if (!open) return null;
  const dark = tone === "dark";
  return (
    <div
      className={`overlay-in fixed inset-0 z-[140] overflow-y-auto ${
        dark ? "bg-b-ink text-b-light" : "bg-paper text-ink"
      }`}
    >
      <header
        className={`sticky top-0 z-10 flex items-center gap-4 px-6 py-5 backdrop-blur md:px-gutter ${
          dark ? "bg-b-ink/90" : "bg-paper/90"
        }`}
      >
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className={`grid h-9 w-9 place-items-center rounded-full border ${
            dark ? "border-b-line" : "border-line"
          }`}
        >
          ←
        </button>
        <SectionHeader
          as="h1"
          size="compact"
          eyebrow="Atelier"
          title="Saved Looks"
          tone={dark ? "dark" : "light"}
        />
      </header>

      <div className="mx-auto max-w-[1180px] px-6 pb-24 pt-6 md:px-gutter">
        {!isLoggedIn ? (
          <div className="flex flex-col items-center gap-6 py-20 text-center">
            <h2 className="max-w-[22ch] text-t2 font-extrabold">
              내 룩 컬렉션을 만들려면{" "}
              <span className={dark ? "text-b-accent" : "text-accent"}>로그인</span>
              하세요.
            </h2>
            <Cta
              variant="gate"
              onClick={onSignIn}
              className={dark ? "bg-b-accent text-b-ink" : ""}
            >
              로그인하고 시작하기
            </Cta>
            <div
              aria-hidden
              className="pointer-events-none mt-6 grid w-full max-w-[680px] grid-cols-3 gap-3 opacity-60 blur-[1.5px]"
            >
              {(["office", "date", "sport"] as LookTone[]).map((t) => (
                <div
                  key={t}
                  className={`tone-${t} flex aspect-[3/4] items-center justify-center rounded-card`}
                >
                  <GarmentSvg tone={t} className="h-3/4 w-3/4 p-4" />
                </div>
              ))}
            </div>
          </div>
        ) : savedLooks.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <p className="text-t4 font-extrabold">아직 저장한 룩이 없어요.</p>
            <p className={`text-t5 ${dark ? "text-b-light/60" : "text-ink-soft"}`}>
              마음에 드는 룩에서 첫 룩을 저장해보세요.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
            {savedLooks.map((l) => (
              <LookCard key={l.id} look={l} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
