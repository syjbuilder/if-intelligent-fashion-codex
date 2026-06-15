import { render, screen } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { ServiceIntro } from "../ServiceIntro";

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

describe("ServiceIntro (핀 고정 코랄 라인)", () => {
  afterEach(() => stubMatchMedia(false));

  it("3개 키워드와 본문을 렌더한다", () => {
    stubMatchMedia(false);
    render(<ServiceIntro />);
    expect(screen.getByText("상상하면")).toBeInTheDocument();
    expect(screen.getByText("만들어지고")).toBeInTheDocument();
    expect(screen.getByText("입을 수 있다")).toBeInTheDocument();
    expect(screen.getByText(/한 문장이면 충분합니다/)).toBeInTheDocument();
  });

  it("기본은 핀 고정 모드(코랄 라인 + sticky)다", () => {
    stubMatchMedia(false);
    const { container } = render(<ServiceIntro />);
    const section = container.querySelector("section");
    expect(section?.getAttribute("data-mode")).toBe("pinned");
    expect(container.querySelector("[data-coral-line]")).not.toBeNull();
    expect(container.querySelector(".sticky")).not.toBeNull();
  });

  it("reduced-motion이면 정적 스택 모드(sticky 없음)다", () => {
    stubMatchMedia(true);
    const { container } = render(<ServiceIntro />);
    const section = container.querySelector("section");
    expect(section?.getAttribute("data-mode")).toBe("static");
    expect(container.querySelector(".sticky")).toBeNull();
    expect(screen.getByText("상상하면")).toBeInTheDocument();
  });
});
