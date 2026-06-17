// @vitest-environment node
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createBrowserSupabaseClient } from "../browser";

describe("createBrowserSupabaseClient — anon 클라이언트", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-anon-key");
  });

  afterEach(() => vi.unstubAllEnvs());

  it("anon 키로 클라이언트를 반환한다", () => {
    const client = createBrowserSupabaseClient();
    expect(client).toBeDefined();
    expect(typeof client.from).toBe("function");
  });

  it("auth.signInWithOAuth를 노출한다 — @supabase/ssr 브라우저 클라이언트", () => {
    const client = createBrowserSupabaseClient();
    expect(typeof client.auth.signInWithOAuth).toBe("function");
  });

  it("필수 env 누락 시 throw", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
    expect(() => createBrowserSupabaseClient()).toThrow();
  });
});
