"use client";

import { useReducer, useState } from "react";
import { Topbar } from "@/components/landing/Topbar";
import type { MenuItem } from "@/components/landing/MenuTray";
import { LoadingScene } from "@/components/studio/LoadingScene";
import { AuthOverlay } from "@/components/studio/AuthOverlay";
import { HistoryOverlay } from "@/components/studio/HistoryOverlay";
import { RecentPromptsDrawer } from "@/components/studio/RecentPromptsDrawer";
import { useAuth } from "@/lib/auth/AuthProvider";
import { ExploreScene } from "@/components/variant-a/studio/ExploreScene";
import { ResultsScene } from "@/components/variant-a/studio/ResultsScene";
import { LookDetailScene } from "@/components/variant-a/studio/LookDetailScene";
import { PromptDock } from "@/components/variant-a/studio/PromptDock";
import { RESULT_LOOKS, PRODUCTS_BY_LOOK } from "@/lib/looks-fixtures";

// Variant A 스튜디오 — scene 머신에 detail 추가(explore→loading→results→detail).
// 프롬프트 draft는 페이지가 소유(reducer committed prompt와 분리) → 하단 고정 도크가 전 scene 지속.
type Scene = "explore" | "loading" | "results" | "detail" | "error";
type State = { scene: Scene; prompt: string; selectedLookId: string | null };
type Action =
  | { type: "generate"; prompt: string }
  | { type: "ready" }
  | { type: "fail" }
  | { type: "detail"; lookId: string }
  | { type: "backToResults" }
  | { type: "reset" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "generate":
      return { ...state, scene: "loading", prompt: action.prompt };
    case "ready":
      return { ...state, scene: "results" };
    case "fail":
      return { ...state, scene: "error" };
    case "detail":
      return { ...state, scene: "detail", selectedLookId: action.lookId };
    case "backToResults":
      return { ...state, scene: "results", selectedLookId: null };
    case "reset":
      return { ...state, scene: "explore", selectedLookId: null };
    default:
      return state;
  }
}

export default function VariantAStudioPage() {
  const [state, dispatch] = useReducer(reducer, {
    scene: "explore",
    prompt: "",
    selectedLookId: null,
  });
  // 하단 도크의 편집 draft(전 scene 지속, 생성 후 직전 프롬프트로 pre-fill).
  const [draft, setDraft] = useState("");
  const [authOpen, setAuthOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [recentOpen, setRecentOpen] = useState(false);
  const { isLoggedIn } = useAuth();

  const submitPrompt = (p: string) => {
    const prompt = p.trim();
    if (!prompt) return;
    setDraft(prompt);
    dispatch({ type: "generate", prompt });
  };

  const regenerate = () => dispatch({ type: "generate", prompt: state.prompt });

  const selected =
    state.selectedLookId != null
      ? RESULT_LOOKS.find((l) => l.id === state.selectedLookId) ?? null
      : null;

  const menuItems: MenuItem[] = [
    { label: "Explore", n: "01", onClick: () => dispatch({ type: "reset" }) },
    { label: "Recent prompts", n: "02", onClick: () => setRecentOpen(true) },
    { label: "Saved Looks", n: "03", onClick: () => setHistoryOpen(true) },
    { label: "New Prompt", n: "04", onClick: () => dispatch({ type: "reset" }) },
  ];

  // 상세(detail)에서는 도크 숨김 — 상품 가시성 우선(PO 피드백 2026-06-15).
  const dockVisible = state.scene === "explore" || state.scene === "results";

  return (
    <div className="relative min-h-screen bg-paper">
      <Topbar menuItems={menuItems} onLogin={() => setAuthOpen(true)} />

      <div key={state.scene} className="scene-in">
        {state.scene === "explore" && <ExploreScene onRefill={setDraft} />}

        {state.scene === "loading" && (
          <LoadingScene
            promptLabel={state.prompt}
            onDone={() => dispatch({ type: "ready" })}
          />
        )}

        {state.scene === "results" && (
          <ResultsScene
            onDetail={(lookId) => dispatch({ type: "detail", lookId })}
            onRegenerate={regenerate}
            onMoreLike={regenerate}
            onRefine={regenerate}
          />
        )}

        {state.scene === "detail" && selected && (
          <LookDetailScene
            look={selected}
            products={PRODUCTS_BY_LOOK[selected.id] ?? []}
            onBack={() => dispatch({ type: "backToResults" })}
            onRegenerate={regenerate}
            onMoreLike={regenerate}
            onRefine={regenerate}
          />
        )}

        {state.scene === "error" && (
          <section className="bg-slate-scene relative flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center text-white-soft">
            <p className="text-t3 font-extrabold">룩을 그리지 못했어요</p>
            <p className="text-t5 text-white-soft/70">
              사용한 토큰은 자동 환불됐어요. 잠시 후 다시 시도해 주세요.
            </p>
            <button
              type="button"
              onClick={() => dispatch({ type: "reset" })}
              className="mt-2 rounded-full bg-white-soft px-6 py-3 text-t6 font-extrabold uppercase tracking-[0.1em] text-ink"
            >
              다시 시도
            </button>
          </section>
        )}
      </div>

      {/* 중앙 하단 고정 프롬프트 도크 — explore/results/detail 지속, 직전 프롬프트 pre-fill */}
      {dockVisible && (
        <div className="fixed bottom-[clamp(16px,4vh,32px)] left-1/2 z-40 w-[min(720px,92vw)] -translate-x-1/2">
          <PromptDock value={draft} onChange={setDraft} onSubmit={submitPrompt} />
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
        isLoggedIn={isLoggedIn}
        onSignIn={() => {
          setHistoryOpen(false);
          setAuthOpen(true);
        }}
      />
      <RecentPromptsDrawer
        open={recentOpen}
        onClose={() => setRecentOpen(false)}
      />
    </div>
  );
}
