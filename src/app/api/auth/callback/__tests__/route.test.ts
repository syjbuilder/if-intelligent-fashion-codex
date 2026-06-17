// @vitest-environment node
import { describe, it, expect, beforeEach, vi } from "vitest";

const exchangeCodeForSession = vi.fn();
vi.mock("@/lib/supabase/serverClient", () => ({
  createServerSupabaseClient: vi.fn(async () => ({
    auth: { exchangeCodeForSession },
  })),
}));

import { GET } from "../route";

describe("GET /api/auth/callback", () => {
  beforeEach(() => {
    exchangeCodeForSession.mockReset();
    exchangeCodeForSession.mockResolvedValue({ error: null });
  });

  it("code를 세션으로 교환하고 next로 redirect한다", async () => {
    const req = new Request(
      "http://localhost:3000/api/auth/callback?code=abc&next=/studio",
    );
    const res = await GET(req);
    expect(res.headers.get("location")).toBe("http://localhost:3000/studio");
    expect(exchangeCodeForSession).toHaveBeenCalledWith("abc");
  });

  it("교환 에러 시 auth_error=callback으로 redirect", async () => {
    exchangeCodeForSession.mockResolvedValue({ error: { message: "bad" } });
    const req = new Request(
      "http://localhost:3000/api/auth/callback?code=abc&next=/studio",
    );
    const res = await GET(req);
    expect(res.headers.get("location")).toBe(
      "http://localhost:3000/?auth_error=callback",
    );
  });

  it("code가 없으면 교환 없이 에러로 redirect", async () => {
    const req = new Request("http://localhost:3000/api/auth/callback");
    const res = await GET(req);
    expect(res.headers.get("location")).toBe(
      "http://localhost:3000/?auth_error=callback",
    );
    expect(exchangeCodeForSession).not.toHaveBeenCalled();
  });

  it("외부 next는 safeNext로 차단되어 홈으로 간다", async () => {
    const req = new Request(
      "http://localhost:3000/api/auth/callback?code=abc&next=https://evil.com",
    );
    const res = await GET(req);
    expect(res.headers.get("location")).toBe("http://localhost:3000/");
  });
});
