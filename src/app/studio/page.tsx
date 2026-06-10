"use client";

import { useReducer, useState } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/brand/BrandMark";
import { ExploreScene } from "@/components/studio/ExploreScene";
import { LoadingScene } from "@/components/studio/LoadingScene";
import { ResultsScene } from "@/components/studio/ResultsScene";
import { AuthOverlay } from "@/components/studio/AuthOverlay";
import { HistoryOverlay } from "@/components/studio/HistoryOverlay";
import { ProductDrawer } from "@/components/studio/ProductDrawer";
import type { StudioScene } from "@/types/ui";

type State = { scene: StudioScene; prompt: string };
type Action =
  | { type: "generate"; prompt: string }
  | { type: "ready" }
  | { type: "fail" }
  | { type: "reset" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "generate":
      return { scene: "loading", prompt: action.prompt };
    case "ready":
      return { ...state, scene: "results" };
    case "fail":
      return { ...state, scene: "error" };
    case "reset":
      return { ...state, scene: "explore" };
    default:
      return state;
  }
}

/**
 * 워크스페이스 셸 — scene 상태머신(explore→loading→results→error) + auth/history/drawer 오버레이.
 * 모든 전환·토글은 클라이언트 상태만(외부 API 0). 실제 생성·토큰·세션·상품 fetch는 다음 phase.
 */
export default function StudioPage() {
  const [state, dispatch] = useReducer(reducer, { scene: "explore", prompt: "" });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  // mock — 실제 세션/저장은 다음 phase. 비로그인 기준으로 gate·로그인 유도 노출.
  const isLoggedIn = false;

  return (
    <div className="relative min-h-screen bg-paper">
      <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-[34px] py-5">
        <Link
          href="/"
          className="text-ink transition-opacity hover:opacity-70"
          aria-label="홈으로"
        >
          <BrandMark className="!items-start" />
        </Link>
        <div className="flex items-center gap-7 text-t7 font-extrabold uppercase tracking-[0.18em] text-ink">
          <button
            type="button"
            onClick={() => setHistoryOpen(true)}
            className="transition-opacity hover:opacity-60"
          >
            Saved
          </button>
          <button
            type="button"
            onClick={() => setAuthOpen(true)}
            className="transition-opacity hover:opacity-60"
          >
            Login
          </button>
        </div>
      </header>

      {state.scene === "explore" && (
        <ExploreScene
          onGenerate={(prompt) => dispatch({ type: "generate", prompt })}
        />
      )}
      {state.scene === "loading" && (
        <LoadingScene
          promptLabel={state.prompt}
          onDone={() => dispatch({ type: "ready" })}
        />
      )}
      {state.scene === "results" && (
        <ResultsScene
          onRegenerate={() =>
            dispatch({ type: "generate", prompt: state.prompt })
          }
          onMoreLike={() =>
            dispatch({ type: "generate", prompt: state.prompt })
          }
          onRefine={() => dispatch({ type: "generate", prompt: state.prompt })}
          onOpenDrawer={() => setDrawerOpen(true)}
        />
      )}
      {state.scene === "error" && (
        <section className="bg-slate-scene flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center text-white-soft">
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

      <ProductDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
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
    </div>
  );
}
