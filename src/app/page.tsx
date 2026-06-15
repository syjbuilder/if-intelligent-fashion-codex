"use client";

import { useState } from "react";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { Topbar } from "@/components/landing/Topbar";
import type { MenuItem } from "@/components/landing/MenuTray";
import { BrandIntro } from "@/components/variant-b/landing/BrandIntro";
import { Hero } from "@/components/variant-b/landing/Hero";
import { ServiceIntro } from "@/components/variant-b/landing/ServiceIntro";
import { CuratedRail } from "@/components/variant-b/landing/CuratedRail";
import { SiteFooterB } from "@/components/variant-b/landing/SiteFooterB";
import { AuthOverlay } from "@/components/studio/AuthOverlay";
import { HistoryOverlay } from "@/components/studio/HistoryOverlay";
import { RecentPromptsDrawer } from "@/components/studio/RecentPromptsDrawer";

// 메인 사이트 = Variant B(레퍼런스 재설계, 다크+코랄). PO 선택으로 / 승격.
// A는 /a·/a/studio, 현행은 /baseline·/baseline/studio, 비교 허브는 /compare에 보존.
// theme-b + MotionProvider를 페이지가 직접 래핑(루트 layout은 공용 유지).
export default function Home() {
  const [authOpen, setAuthOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [recentOpen, setRecentOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { label: "Explore", n: "01", href: "/studio" },
    { label: "Recent prompts", n: "02", onClick: () => setRecentOpen(true) },
    { label: "Saved Looks", n: "03", onClick: () => setHistoryOpen(true) },
    { label: "New Prompt", n: "04", href: "/studio" },
  ];

  return (
    <MotionProvider>
      <div className="theme-b">
        <BrandIntro />
        <Topbar menuItems={menuItems} onLogin={() => setAuthOpen(true)} />
        <main>
          <Hero />
          <ServiceIntro />
          <CuratedRail />
        </main>
        <SiteFooterB />

        <AuthOverlay
          open={authOpen}
          onClose={() => setAuthOpen(false)}
          onSelectProvider={() => setAuthOpen(false)}
          tone="dark"
        />
        <HistoryOverlay
          open={historyOpen}
          onClose={() => setHistoryOpen(false)}
          isLoggedIn={false}
          tone="dark"
          onSignIn={() => {
            setHistoryOpen(false);
            setAuthOpen(true);
          }}
        />
        <RecentPromptsDrawer open={recentOpen} onClose={() => setRecentOpen(false)} />
      </div>
    </MotionProvider>
  );
}
