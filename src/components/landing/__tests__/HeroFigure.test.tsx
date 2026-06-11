import { render, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { ComponentProps } from "react";
import { HeroFigure } from "../HeroFigure";
import { HERO_LOOKS, HERO_ROTATE_MS } from "@/lib/hero-looks";

// jsdom에는 next/image 최적화 런타임이 없다 → 일반 <img>로 대체.
vi.mock("next/image", () => ({
  default: (props: ComponentProps<"img"> & { fill?: boolean; priority?: boolean }) => {
    const { fill: _fill, priority: _priority, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...rest} />;
  },
}));

function activeIndex(container: HTMLElement): number {
  const imgs = [...container.querySelectorAll(".hero-figure-img")];
  return imgs.findIndex((el) => el.classList.contains("is-active"));
}

function stubMatchMedia(matches: boolean) {
  window.matchMedia = ((q: string) => ({
    matches,
    media: q,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return false;
    },
  })) as unknown as typeof window.matchMedia;
}

function setDocumentHidden(hidden: boolean) {
  Object.defineProperty(document, "hidden", {
    configurable: true,
    get: () => hidden,
  });
  document.dispatchEvent(new Event("visibilitychange"));
}

describe("HeroFigure", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    stubMatchMedia(false);
  });

  afterEach(() => {
    vi.useRealTimers();
    setDocumentHidden(false);
  });

  it("마네킹 룩 7장을 렌더하고 첫 장만 is-active, 컨테이너는 aria-hidden", () => {
    const { container } = render(<HeroFigure />);
    const imgs = container.querySelectorAll(".hero-figure-img");
    expect(imgs).toHaveLength(HERO_LOOKS.length);
    expect(activeIndex(container)).toBe(0);
    expect(
      container.querySelector(".hero-figure")?.getAttribute("aria-hidden"),
    ).toBe("true");
  });

  it("HERO_ROTATE_MS마다 다음 장으로 넘어가고 끝에서 처음으로 랩어라운드한다", () => {
    const { container } = render(<HeroFigure />);
    act(() => vi.advanceTimersByTime(HERO_ROTATE_MS));
    expect(activeIndex(container)).toBe(1);
    act(() => vi.advanceTimersByTime(HERO_ROTATE_MS * (HERO_LOOKS.length - 1)));
    expect(activeIndex(container)).toBe(0);
  });

  it("탭이 숨겨지면 회전을 멈추고 다시 보이면 재개한다", () => {
    const { container } = render(<HeroFigure />);
    act(() => setDocumentHidden(true));
    act(() => vi.advanceTimersByTime(HERO_ROTATE_MS * 3));
    expect(activeIndex(container)).toBe(0);
    act(() => setDocumentHidden(false));
    act(() => vi.advanceTimersByTime(HERO_ROTATE_MS));
    expect(activeIndex(container)).toBe(1);
  });

  it("prefers-reduced-motion이면 첫 장에 고정된다", () => {
    stubMatchMedia(true);
    const { container } = render(<HeroFigure />);
    act(() => vi.advanceTimersByTime(HERO_ROTATE_MS * 3));
    expect(activeIndex(container)).toBe(0);
  });
});
