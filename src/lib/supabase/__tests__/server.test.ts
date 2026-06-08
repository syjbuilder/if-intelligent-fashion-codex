// @vitest-environment node
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createServiceRoleClient } from "../server";

describe("createServiceRoleClient — 서버 전용 service_role 클라이언트 (ADR-016)", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "test-service-role-key");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    delete (globalThis as { window?: unknown }).window;
  });

  it("서버(window 미정의)에서 Supabase 클라이언트를 반환한다", () => {
    const client = createServiceRoleClient();
    expect(client).toBeDefined();
    expect(typeof client.from).toBe("function");
  });

  it("클라이언트 컨텍스트(window 존재)에서 throw — service_role 키 노출 방지", () => {
    (globalThis as { window?: unknown }).window = {};
    expect(() => createServiceRoleClient()).toThrow(/서버/);
  });

  it("필수 env 누락 시 throw", () => {
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");
    expect(() => createServiceRoleClient()).toThrow();
  });
});
