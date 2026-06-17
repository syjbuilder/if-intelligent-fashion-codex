// @vitest-environment node
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// next/headers의 cookies()는 Next 15에서 async — getAll/set을 가진 store를 반환하도록 mock.
vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    getAll: () => [],
    set: () => {},
  })),
}));

import { createServerSupabaseClient } from "../serverClient";

describe("createServerSupabaseClient — SSR 유저 스코프 서버 클라이언트", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-anon-key");
  });

  afterEach(() => vi.unstubAllEnvs());

  it("쿠키 어댑터로 클라이언트를 반환하고 auth(코드 교환)를 노출한다", async () => {
    const client = await createServerSupabaseClient();
    expect(client).toBeDefined();
    expect(typeof client.from).toBe("function");
    expect(typeof client.auth.exchangeCodeForSession).toBe("function");
    expect(typeof client.auth.getUser).toBe("function");
  });

  it("필수 env 누락 시 reject(throw)", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
    await expect(createServerSupabaseClient()).rejects.toThrow(/Supabase/);
  });
});
