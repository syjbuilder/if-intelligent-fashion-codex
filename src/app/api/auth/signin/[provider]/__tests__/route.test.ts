// @vitest-environment node
import { describe, it, expect, beforeEach, vi } from "vitest";

const signInWithOAuth = vi.fn();
vi.mock("@/lib/supabase/serverClient", () => ({
  createServerSupabaseClient: vi.fn(async () => ({ auth: { signInWithOAuth } })),
}));

import { GET } from "../route";

describe("GET /api/auth/signin/[provider]", () => {
  beforeEach(() => {
    signInWithOAuth.mockReset();
    signInWithOAuth.mockResolvedValue({
      data: { url: "https://accounts.google.com/o/oauth2/auth?x=1" },
      error: null,
    });
  });

  it("유효한 provider면 콜백 redirectTo와 함께 OAuth url로 redirect한다", async () => {
    const req = new Request(
      "http://localhost:3000/api/auth/signin/google?next=/studio",
    );
    const res = await GET(req, { params: Promise.resolve({ provider: "google" }) });
    expect(res.status).toBeGreaterThanOrEqual(300);
    expect(res.status).toBeLessThan(400);
    expect(res.headers.get("location")).toBe(
      "https://accounts.google.com/o/oauth2/auth?x=1",
    );
    expect(signInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/api/auth/callback?next=%2Fstudio",
      },
    });
  });

  it("kakao provider도 네이티브로 OAuth url로 redirect한다", async () => {
    signInWithOAuth.mockResolvedValue({
      data: { url: "https://kauth.kakao.com/oauth/authorize?x=1" },
      error: null,
    });
    const req = new Request(
      "http://localhost:3000/api/auth/signin/kakao?next=/studio",
    );
    const res = await GET(req, { params: Promise.resolve({ provider: "kakao" }) });
    expect(res.status).toBeGreaterThanOrEqual(300);
    expect(res.status).toBeLessThan(400);
    expect(res.headers.get("location")).toBe(
      "https://kauth.kakao.com/oauth/authorize?x=1",
    );
    expect(signInWithOAuth).toHaveBeenCalledWith({
      provider: "kakao",
      options: {
        redirectTo: "http://localhost:3000/api/auth/callback?next=%2Fstudio",
        // account_email은 비즈앱 필요 → 닉네임만 요청(KOE205 회피)
        scopes: "profile_nickname",
      },
    });
  });

  it("허용되지 않은 provider는 Supabase 호출 없이 에러로 redirect", async () => {
    const req = new Request("http://localhost:3000/api/auth/signin/facebook");
    const res = await GET(req, {
      params: Promise.resolve({ provider: "facebook" }),
    });
    expect(res.headers.get("location")).toBe(
      "http://localhost:3000/?auth_error=provider",
    );
    expect(signInWithOAuth).not.toHaveBeenCalled();
  });

  it("signInWithOAuth 에러 시 auth_error=signin으로 redirect", async () => {
    signInWithOAuth.mockResolvedValue({
      data: { url: null },
      error: { message: "boom" },
    });
    const req = new Request("http://localhost:3000/api/auth/signin/google");
    const res = await GET(req, { params: Promise.resolve({ provider: "google" }) });
    expect(res.headers.get("location")).toBe(
      "http://localhost:3000/?auth_error=signin",
    );
  });
});
