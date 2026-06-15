import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { BrandIntro } from "../BrandIntro";

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

const KEY = "if:brandIntro:v1";

describe("BrandIntro (세션 1회 인트로)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
    stubMatchMedia(false);
  });
  afterEach(() => {
    vi.useRealTimers();
    document.body.style.overflow = "";
  });

  it("첫 방문이면 인트로를 띄우고 body 스크롤을 잠근다", () => {
    render(<BrandIntro />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("IF")).toBeInTheDocument();
    expect(screen.getByText("INTELLIGENT FASHION")).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("Skip 시 onComplete 호출·세션키 기록·스크롤 복원", () => {
    const onComplete = vi.fn();
    render(<BrandIntro onComplete={onComplete} />);
    fireEvent.click(screen.getByRole("button", { name: /건너뛰기/ }));
    act(() => {
      vi.advanceTimersByTime(900);
    });
    expect(onComplete).toHaveBeenCalled();
    expect(sessionStorage.getItem(KEY)).toBe("1");
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  it("세션키가 이미 있으면 인트로를 띄우지 않는다", () => {
    sessionStorage.setItem(KEY, "1");
    render(<BrandIntro />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("reduced-motion이면 인트로를 건너뛰고 키를 기록한다", () => {
    stubMatchMedia(true);
    render(<BrandIntro />);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(sessionStorage.getItem(KEY)).toBe("1");
  });
});
