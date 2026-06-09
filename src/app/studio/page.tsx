"use client";

import { useReducer } from "react";
import { ExploreScene } from "@/components/studio/ExploreScene";
import { LoadingScene } from "@/components/studio/LoadingScene";
import { ResultsScene } from "@/components/studio/ResultsScene";
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
 * 워크스페이스 셸 — scene 상태머신(explore→loading→results→error)을 useReducer로.
 * 모든 전환은 클라이언트 상태만(외부 API 0). 실제 생성·토큰·상품 fetch는 다음 phase.
 * auth/history/drawer 오버레이는 step 5에서 연결.
 */
export default function StudioPage() {
  const [state, dispatch] = useReducer(reducer, { scene: "explore", prompt: "" });

  return (
    <div className="bg-paper">
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
          onOpenDrawer={() => {
            /* step 5에서 ProductDrawer 토글로 연결 */
          }}
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
    </div>
  );
}
