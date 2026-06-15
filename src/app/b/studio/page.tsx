"use client";

import { useReducer, useState } from "react";
import { Topbar } from "@/components/landing/Topbar";
import type { MenuItem } from "@/components/landing/MenuTray";
import { LoadingScene } from "@/components/studio/LoadingScene";
import { AuthOverlay } from "@/components/studio/AuthOverlay";
import { HistoryOverlay } from "@/components/studio/HistoryOverlay";
import { RecentPromptsDrawer } from "@/components/studio/RecentPromptsDrawer";
import { ExploreScene } from "@/components/variant-b/studio/ExploreScene";
import { ResultsScene } from "@/components/variant-b/studio/ResultsScene";
import { LookDetailScene } from "@/components/variant-b/studio/LookDetailScene";
import { PromptDock } from "@/components/variant-b/studio/PromptDock";
import { RESULT_LOOKS, PRODUCTS_BY_LOOK } from "@/lib/looks-fixtures";

// Variant B 스튜디오 — A와 동일 구조(explore→loading→results→detail), B 디자인 언어.
// detail에서 도크 숨김(A 상세 피드백 반영). LoadingScene/overlays는 공유 베이스라인(후속 B 톤).
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

export default function VariantBStudioPage() {
  const [state, dispatch] = useReducer(reducer, {
    scene: "explore",
    prompt: "",
    selectedLookId: null,
  });
  const [draft, setDraft] = useState("");
  const [authOpen, setAuthOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [recentOpen, setRecentOpen] = useState(false);

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

  const dockVisible = state.scene === "explore" || state.scene === "results";

  return (
    <div className="relative min-h-screen bg-b-ink">
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
          <section className="flex min-h-screen flex-col items-center justify-center gap-4 bg-b-ink px-6 text-center text-b-light">
            <p className="text-t3 font-extrabold">룩을 그리지 못했어요</p>
            <p className="text-t5 text-b-light/60">
              사용한 토큰은 자동 환불됐어요. 잠시 후 다시 시도해 주세요.
            </p>
            <button
              type="button"
              onClick={() => dispatch({ type: "reset" })}
              className="mt-2 rounded-full bg-b-accent px-6 py-3 text-t6 font-extrabold uppercase tracking-[0.1em] text-b-ink"
            >
              다시 시도
            </button>
          </section>
        )}
      </div>

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
        isLoggedIn={false}
        onSignIn={() => {
          setHistoryOpen(false);
          setAuthOpen(true);
        }}
      />
      <RecentPromptsDrawer open={recentOpen} onClose={() => setRecentOpen(false)} />
    </div>
  );
}
