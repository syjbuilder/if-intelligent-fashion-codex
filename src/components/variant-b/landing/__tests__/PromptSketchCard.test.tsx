import { render, screen } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { motionValue } from "framer-motion";
import { PromptSketchCard } from "../PromptSketchCard";

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

describe("PromptSketchCard (스크롤 동기 프롬프트→스케치)", () => {
  afterEach(() => stubMatchMedia(false));

  it("progress를 받아 프롬프트 셸·실루엣 path·상품 칩 구조를 렌더한다", () => {
    stubMatchMedia(false);
    const progress = motionValue(0);
    const { container } = render(<PromptSketchCard progress={progress} />);
    expect(container.querySelector("[data-prompt-sketch-card]")).not.toBeNull();
    expect(container.querySelector("[data-prompt-zone]")).not.toBeNull();
    expect(container.querySelector("svg path")).not.toBeNull();
    expect(container.querySelector("[data-product-chip]")).not.toBeNull();
  });

  it("스크롤 전(progress 0)에는 입력 placeholder와 상품 CTA를 보여준다", () => {
    stubMatchMedia(false);
    const progress = motionValue(0);
    render(<PromptSketchCard progress={progress} />);
    expect(screen.getByText("원하는 스타일의 옷을 표현해보세요")).toBeInTheDocument();
    expect(screen.getByText(/구매처 보기/)).toBeInTheDocument();
    expect(screen.getByText("데이트 슬립 원피스")).toBeInTheDocument();
  });

  it("reduced면 최종 상태(전체 프롬프트 텍스트)를 정적으로 보여준다", () => {
    stubMatchMedia(true);
    const progress = motionValue(0);
    render(<PromptSketchCard progress={progress} />);
    expect(screen.getByText(/여름 데이트, 미니멀 무드/)).toBeInTheDocument();
  });
});
