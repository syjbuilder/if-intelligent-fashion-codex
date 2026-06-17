// @vitest-environment node
import { describe, it, expect, beforeEach, vi } from "vitest";

const signOut = vi.fn();
vi.mock("@/lib/supabase/serverClient", () => ({
  createServerSupabaseClient: vi.fn(async () => ({ auth: { signOut } })),
}));

import { POST } from "../route";

describe("POST /api/auth/signout", () => {
  beforeEach(() => {
    signOut.mockReset();
    signOut.mockResolvedValue({ error: null });
  });

  it("signOut 후 홈으로 303 redirect한다", async () => {
    const req = new Request("http://localhost:3000/api/auth/signout", {
      method: "POST",
    });
    const res = await POST(req);
    expect(res.status).toBe(303);
    expect(res.headers.get("location")).toBe("http://localhost:3000/");
    expect(signOut).toHaveBeenCalledTimes(1);
  });
});
