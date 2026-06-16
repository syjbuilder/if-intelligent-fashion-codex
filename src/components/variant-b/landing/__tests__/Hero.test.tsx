import { render, screen } from "@testing-library/react";
import { describe, expect, it, afterEach } from "vitest";
import { Hero } from "../Hero";

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

describe("variant-b Hero (텍스트 + 우측 로고 인트로)", () => {
  afterEach(() => stubMatchMedia(false));

  it("스튜디오 CTA가 /studio로 연결된다", () => {
    render(<Hero />);
    expect(
      screen.getByRole("link", { name: /스튜디오 시작/ }),
    ).toHaveAttribute("href", "/studio");
  });

  it("히어로 헤드라인을 aria-label로 렌더한다", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", { name: "Wear what you imagine" }),
    ).toBeInTheDocument();
  });

  it("히어로에 마네킹 이미지가 없다", () => {
    const { container } = render(<Hero />);
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector(".b-hero-scrim")).toBeNull();
  });

  it("1화면 핏 패딩·중앙 정렬·min-h를 유지한다", () => {
    const { container } = render(<Hero />);
    const section = container.querySelector("section");
    expect(section?.className).toContain("py-[clamp(72px,9vh,112px)]");
    expect(section?.className).toContain("items-center");
    expect(section?.className).toContain("min-h-[100svh]");
  });

  it("우측에 IF 로고 인트로가 있다", () => {
    render(<Hero />);
    expect(screen.getByText("IF")).toBeInTheDocument();
  });

  it("reduced-motion이면 헤드라인과 로고를 즉시 노출한다", () => {
    stubMatchMedia(true);
    render(<Hero />);
    expect(
      screen.getByRole("heading", { name: "Wear what you imagine" }),
    ).toBeInTheDocument();
    expect(screen.getByText("IF")).toBeInTheDocument();
  });

  it("본문이 한국어 고아 단어 방지 클래스를 쓴다", () => {
    render(<Hero />);
    const body = screen.getByText(/한 문장이면 충분해요/);
    expect(body.className).toContain("[word-break:keep-all]");
    expect(body.className).toContain("[text-wrap:balance]");
  });
});
