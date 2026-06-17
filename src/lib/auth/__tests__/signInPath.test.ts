// @vitest-environment node
import { describe, it, expect } from "vitest";
import { safeNext, buildSignInPath } from "../signInPath";

describe("safeNext — 오픈 리다이렉트 가드", () => {
  it("내부 절대경로는 그대로 통과", () => {
    expect(safeNext("/studio")).toBe("/studio");
    expect(safeNext("/")).toBe("/");
    expect(safeNext("/a/studio")).toBe("/a/studio");
  });

  it("외부·프로토콜상대·역슬래시·상대·빈값은 '/'로 차단", () => {
    expect(safeNext("https://evil.com")).toBe("/");
    expect(safeNext("//evil.com")).toBe("/");
    expect(safeNext("/\\evil.com")).toBe("/");
    expect(safeNext("studio")).toBe("/");
    expect(safeNext("")).toBe("/");
    expect(safeNext(null)).toBe("/");
    expect(safeNext(undefined)).toBe("/");
  });
});

describe("buildSignInPath", () => {
  it("next가 있으면 인코딩된 쿼리를 포함한다", () => {
    expect(buildSignInPath("google", "/studio")).toBe(
      "/api/auth/signin/google?next=%2Fstudio",
    );
  });

  it("next가 없거나 '/'면 쿼리를 생략한다", () => {
    expect(buildSignInPath("google")).toBe("/api/auth/signin/google");
    expect(buildSignInPath("kakao", "/")).toBe("/api/auth/signin/kakao");
  });

  it("외부 next는 safeNext로 차단되어 쿼리가 제거된다", () => {
    expect(buildSignInPath("naver", "https://evil.com")).toBe(
      "/api/auth/signin/naver",
    );
  });
});
