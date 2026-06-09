// @vitest-environment node
//
// DB 스모크 검증 — 호스티드 Supabase(=staging)에 마이그레이션 001~007 적용 후 실행.
// service_role로 연결해 ① 10테이블 존재 ② plans 시드 ③ RLS 강제(behavioral) ④ 토큰 RPC 멱등성.
// 키(.env.local)가 없는 환경(CI 등)에서는 자동 skip — step5.md "키 있을 때".
//
// 주의: 실 DB에 테스트 유저 1명을 만들고 검증 후 즉시 삭제한다(teardown). production 직접 쿼리 금지(CLAUDE.md)
// → 이 프로젝트를 staging으로 다룬다.
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

// vitest는 .env.local을 자동 로드하지 않는다 → 직접 파싱해 process.env로 주입(기존 값 우선).
function loadEnvLocal(): void {
  const p = resolve(process.cwd(), ".env.local");
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
  }
}
loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const hasKeys = Boolean(url && anonKey && serviceKey);

const TABLES = [
  "users",
  "looks",
  "products",
  "look_products",
  "saved_looks",
  "prompt_intents",
  "generation_history",
  "token_transactions",
  "plans",
  "payments",
] as const;

// 본인/비공개 행만 보이는 테이블 — anon은 service_role이 넣은 테스트 행을 못 봐야 RLS가 켜진 것.
const OWNER_SCOPED = [
  "users",
  "saved_looks",
  "prompt_intents",
  "generation_history",
  "token_transactions",
  "payments",
] as const;

describe.skipIf(!hasKeys)("DB 스모크 — 마이그레이션 001~007 적용 검증 (service_role, 실 DB)", () => {
  let admin: SupabaseClient;
  let anon: SupabaseClient;
  let testUserId: string;
  const idemKey = `smoke-${Date.now()}`;

  beforeAll(async () => {
    admin = createClient(url!, serviceKey!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    anon = createClient(url!, anonKey!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    // 테스트 유저(잔액 10) 생성 — RPC·RLS 검증용. id는 임의 UUID.
    testUserId = crypto.randomUUID();
    const { error } = await admin.from("users").insert({
      id: testUserId,
      auth_provider: "smoke",
      email: `${testUserId}@smoke.local`,
      token_balance: 10,
    });
    if (error) throw new Error(`테스트 유저 생성 실패: ${error.message}`);
  });

  afterAll(async () => {
    if (!admin || !testUserId) return;
    // teardown: 트랜잭션 → 유저 순서로 정리(FK).
    await admin.from("token_transactions").delete().eq("user_id", testUserId);
    await admin.from("users").delete().eq("id", testUserId);
  });

  // ① 10테이블 존재
  it("① 10개 테이블이 모두 존재한다", async () => {
    for (const t of TABLES) {
      const { error } = await admin.from(t).select("*", { head: true, count: "exact" });
      expect(error, `테이블 ${t} 조회 에러: ${error?.message}`).toBeNull();
    }
  });

  // ② plans 시드 (free/pro/max)
  it("② plans에 free/pro/max 시드가 있고 토큰 grant가 정합한다", async () => {
    const { data, error } = await admin
      .from("plans")
      .select("code, monthly_token_grant")
      .in("code", ["free", "pro", "max"]);
    expect(error).toBeNull();
    const byCode = Object.fromEntries((data ?? []).map((r) => [r.code, r.monthly_token_grant]));
    expect(byCode.free).toBe(10);
    expect(byCode.pro).toBe(100);
    expect(byCode.max).toBe(200);
  });

  // ③ RLS 강제 — anon은 service_role이 넣은 본인-범위 행을 보지 못한다(= RLS enabled & 강제 중).
  it("③ owner-scoped 테이블에 RLS가 켜져 anon 접근이 차단된다", async () => {
    // service_role은 본다(테스트 유저 존재 확인).
    const { data: adminSees } = await admin.from("users").select("id").eq("id", testUserId);
    expect(adminSees?.length).toBe(1);

    // anon은 같은 행을 못 본다(0행). RLS가 꺼져 있었다면 anon이 행을 봤을 것.
    const { data: anonUsers } = await anon.from("users").select("id").eq("id", testUserId);
    expect(anonUsers ?? []).toHaveLength(0);

    for (const t of OWNER_SCOPED) {
      const { data } = await anon.from(t).select("*").limit(50);
      expect(data ?? [], `anon이 ${t} 행을 봄 → RLS 미적용 의심`).toHaveLength(0);
    }
  });

  // ④ consume/refund 멱등성 — 같은 키 재호출 시 중복 차감 0
  it("④ consume_tokens 멱등 — 같은 idempotency_key 재호출 시 중복 차감 0", async () => {
    // 1차 차감: 10 → 0
    const first = await admin.rpc("consume_tokens", {
      p_user_id: testUserId,
      p_amount: 10,
      p_reason: "generation",
      p_idempotency_key: idemKey,
      p_related_generation_id: null,
    });
    expect(first.error, `consume_tokens 에러: ${first.error?.message}`).toBeNull();

    const afterFirst = await admin.from("users").select("token_balance").eq("id", testUserId).single();
    expect(afterFirst.data?.token_balance).toBe(0);

    // 2차 동일 키 재호출: 차감 없이 기존 tx 반환 → 잔액 불변(0)
    const second = await admin.rpc("consume_tokens", {
      p_user_id: testUserId,
      p_amount: 10,
      p_reason: "generation",
      p_idempotency_key: idemKey,
      p_related_generation_id: null,
    });
    expect(second.error).toBeNull();

    const afterSecond = await admin.from("users").select("token_balance").eq("id", testUserId).single();
    expect(afterSecond.data?.token_balance, "멱등 위반: 재호출이 중복 차감함").toBe(0);

    // spend 트랜잭션은 1건만 기록돼야 함(멱등).
    const spends = await admin
      .from("token_transactions")
      .select("id")
      .eq("user_id", testUserId)
      .eq("idempotency_key", idemKey);
    expect(spends.data ?? []).toHaveLength(1);
  });

  it("④ refund_tokens — 환불 시 잔액이 복구된다", async () => {
    const refund = await admin.rpc("refund_tokens", {
      p_user_id: testUserId,
      p_amount: 10,
      p_idempotency_key: `${idemKey}:refund`,
      p_related_generation_id: null,
    });
    expect(refund.error, `refund_tokens 에러: ${refund.error?.message}`).toBeNull();

    const after = await admin.from("users").select("token_balance").eq("id", testUserId).single();
    expect(after.data?.token_balance).toBe(10);
  });
});
