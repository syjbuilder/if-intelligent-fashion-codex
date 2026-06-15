"use client";

import { useState } from "react";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { Topbar } from "@/components/landing/Topbar";
import type { MenuItem } from "@/components/landing/MenuTray";
import { Hero } from "@/components/variant-b/landing/Hero";
import { CuratedRail } from "@/components/variant-b/landing/CuratedRail";
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
        <Topbar menuItems={menuItems} onLogin={() => setAuthOpen(true)} />
        <main>
          <Hero />
          <CuratedRail />
        </main>
        <footer className="bg-b-ink px-6 py-12 text-b-light/50 md:px-gutter">
          <p className="text-t7 leading-relaxed">
            © I.F — Wear what you imagine. 각 상품은 외부 온라인몰에서 구매하며 I.F는 자체 결제를 제공하지 않습니다(어필리에이트 고지).
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
      </div>
    </MotionProvider>
  );
}
