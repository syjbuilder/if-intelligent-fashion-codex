// @vitest-environment node
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

const getUser = vi.fn().mockResolvedValue({ data: { user: null } });
vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(() => ({ auth: { getUser } })),
}));

import { NextRequest } from "next/server";
import { middleware, config } from "../middleware";

describe("middleware — 세션 갱신", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-anon-key");
    getUser.mockClear();
  });

  afterEach(() => vi.unstubAllEnvs());

  it("요청마다 getUser로 세션을 갱신하고 NextResponse를 반환한다", async () => {
    const req = new NextRequest("http://localhost:3000/studio");
    const res = await middleware(req);
    expect(res).toBeDefined();
    expect(res.cookies).toBeDefined();
    expect(getUser).toHaveBeenCalledTimes(1);
  });

  it("matcher가 정적 자산(_next/static·_next/image)을 제외한다", () => {
    const m = Array.isArray(config.matcher)
      ? config.matcher.join(" ")
      : String(config.matcher);
    expect(m).toContain("_next/static");
    expect(m).toContain("_next/image");
  });
});
