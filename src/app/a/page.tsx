"use client";

import { useState } from "react";
import { Topbar } from "@/components/landing/Topbar";
import type { MenuItem } from "@/components/landing/MenuTray";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { CuratedPreview } from "@/components/variant-a/landing/CuratedPreview";
import { AuthOverlay } from "@/components/studio/AuthOverlay";
import { HistoryOverlay } from "@/components/studio/HistoryOverlay";
import { RecentPromptsDrawer } from "@/components/studio/RecentPromptsDrawer";

// Variant A 랜딩 — 베이스라인 Hero/HowItWorks/Footer 유지(I.F 정체성) + CuratedPreview를
// 실사 카드 레일(variant-a)로 끌어올림. 메뉴·CTA는 /a/studio로.
type DocKind = "terms" | "privacy";

export default function VariantAHome() {
  const [doc, setDoc] = useState<DocKind | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [recentOpen, setRecentOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { label: "Explore", n: "01", href: "/a/studio" },
    { label: "Recent prompts", n: "02", onClick: () => setRecentOpen(true) },
    { label: "Saved Looks", n: "03", onClick: () => setHistoryOpen(true) },
    { label: "New Prompt", n: "04", href: "/a/studio" },
  ];

  return (
    <>
      <Topbar menuItems={menuItems} onLogin={() => setAuthOpen(true)} />
      <main>
        <Hero />
        <HowItWorks />
        <CuratedPreview />
      </main>
      <SiteFooter
        onOpenTerms={() => setDoc("terms")}
        onOpenPrivacy={() => setDoc("privacy")}
      />

      {doc && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={doc === "terms" ? "이용약관" : "개인정보처리방침"}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[rgba(8,6,5,0.86)] p-6"
          onClick={() => setDoc(null)}
        >
          <div
            className="max-h-[84vh] w-[min(720px,92vw)] overflow-y-auto rounded-2xl bg-paper p-8 text-ink"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-t7 font-extrabold uppercase tracking-[0.18em] text-muted">
              {doc === "terms" ? "Terms of Service" : "Privacy Policy"}
            </p>
            <h2 className="mt-2 text-t3 font-extrabold">
              {doc === "terms" ? "이용약관" : "개인정보처리방침"}
            </h2>
            <p className="mt-4 text-left text-t5 text-ink-soft">
              전문은 정식 오픈 전 공개됩니다. (셸 단계 — 본문 콘텐츠는 후속 작업)
            </p>
            <button
              type="button"
              onClick={() => setDoc(null)}
              className="mt-6 text-t6 font-extrabold uppercase tracking-[0.12em] transition-opacity hover:opacity-60"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <AuthOverlay
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSelectProvider={() => setAuthOpen(false)}
      />
      <HistoryOverlay
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        isLoggedIn={false}
        onSignIn={() => {
          setHistoryOpen(false);
          setAuthOpen(true);
        }}
      />
      <RecentPromptsDrawer open={recentOpen} onClose={() => setRecentOpen(false)} />
    </>
  );
}
