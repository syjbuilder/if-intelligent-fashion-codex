import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * 서버 전용 Supabase 클라이언트 (service_role 키 = 전체 권한, RLS 우회).
 *
 * - 라우트 핸들러(`src/app/api/`)·서버 액션 등 **서버 영역에서만** 호출한다
 *   (CLAUDE.md CRITICAL: 외부 API/키는 서버 영역만, ADR-016 service_role 쓰기 경계).
 * - 클라이언트 번들에 유입되면 키가 노출되므로, `window`가 존재하면 즉시 throw하는
 *   런타임 가드를 둔다.
 */
export function createServiceRoleClient(): SupabaseClient {
  if (typeof window !== "undefined") {
    throw new Error(
      "createServiceRoleClient는 서버 영역에서만 호출해야 합니다 — service_role 키 노출 방지 (ADR-016)",
    );
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase 환경변수 누락: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (.env.local 확인)",
    );
  }
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
