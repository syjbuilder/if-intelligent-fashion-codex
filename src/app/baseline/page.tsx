"use client";

import { useState } from "react";
import { Topbar } from "@/components/landing/Topbar";
import type { MenuItem } from "@/components/landing/MenuTray";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CuratedPreview } from "@/components/landing/CuratedPreview";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { AuthOverlay } from "@/components/studio/AuthOverlay";
import { HistoryOverlay } from "@/components/studio/HistoryOverlay";
import { RecentPromptsDrawer } from "@/components/studio/RecentPromptsDrawer";

// 현행(v0.8) 랜딩 — 비교 기준선. 루트 /가 비교 허브가 되면서 이 경로(/baseline)로 이동.
// 내용은 종전 src/app/page.tsx 그대로(무변경).
type DocKind = "terms" | "privacy";

export default function BaselineHome() {
  const [doc, setDoc] = useState<DocKind | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [recentOpen, setRecentOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { label: "Explore", n: "01", href: "/baseline/studio" },
    { label: "Recent prompts", n: "02", onClick: () => setRecentOpen(true) },
    { label: "Saved Looks", n: "03", onClick: () => setHistoryOpen(true) },
    { label: "New Prompt", n: "04", href: "/baseline/studio" },
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
      <RecentPromptsDrawer
        open={recentOpen}
        onClose={() => setRecentOpen(false)}
      />
    </>
  );
}
