import "@testing-library/jest-dom";
import { vi } from "vitest";

// jsdom에는 IntersectionObserver·matchMedia가 없다 → 진입 모션(useReveal 등)을 쓰는
// 컴포넌트 렌더가 ReferenceError로 깨지지 않도록 전역 stub을 둔다.
// node 환경(// @vitest-environment node) 테스트에는 window가 없으므로 가드한다.
if (typeof window !== "undefined") {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    },
  );

  if (!window.matchMedia) {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (query: string) => ({
        matches: false, // prefers-reduced-motion 기본 false
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
  }

  // framer-motion의 layout(layoutId)·useScroll은 ResizeObserver를 요구하는데 jsdom엔 없다.
  // Element.prototype.animate(WAAPI)는 일부러 스텁하지 않는다 — 그래야 framer가
  // supportsWaapi()=false로 판단해 jsdom-safe한 fallback 경로를 탄다(반쪽 stub 금지).
  if (!("ResizeObserver" in window)) {
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
  }
}
