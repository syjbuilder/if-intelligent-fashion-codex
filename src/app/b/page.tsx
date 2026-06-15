"use client";

import { useState } from "react";
import { Topbar } from "@/components/landing/Topbar";
import type { MenuItem } from "@/components/landing/MenuTray";
import { Hero } from "@/components/variant-b/landing/Hero";
import { CuratedRail } from "@/components/variant-b/landing/CuratedRail";
import { AuthOverlay } from "@/components/studio/AuthOverlay";
import { HistoryOverlay } from "@/components/studio/HistoryOverlay";
import { RecentPromptsDrawer } from "@/components/studio/RecentPromptsDrawer";

// Variant B 랜딩 — 레퍼런스 주도 재설계(다크+코랄+키네틱). 베이스라인과 다른 섹션 구조.
// 오버레이(Auth/History/Recent)는 당분간 공유 베이스라인 사용(후속 B 톤 적용).
export default function VariantBHome() {
  const [authOpen, setAuthOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [recentOpen, setRecentOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { label: "Explore", n: "01", href: "/b/studio" },
    { label: "Recent prompts", n: "02", onClick: () => setRecentOpen(true) },
    { label: "Saved Looks", n: "03", onClick: () => setHistoryOpen(true) },
    { label: "New Prompt", n: "04", href: "/b/studio" },
  ];

  return (
    <>
      <Topbar menuItems={menuItems} onLogin={() => setAuthOpen(true)} />
      <main>
        <Hero />
        <CuratedRail />
      </main>
      <footer className="bg-b-ink px-6 py-12 text-b-light/50 md:px-gutter">
        <p className="text-t7 leading-relaxed">
          © I.F — Variant B 시안. 각 상품은 외부 온라인몰에서 구매하며 I.F는 자체 결제를 제공하지 않습니다(어필리에이트 고지).
        </p>
      </footer>

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
