import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * 브라우저/클라이언트 컴포넌트용 Supabase 클라이언트 (anon 키 — RLS로 보호).
 *
 * service_role 키는 절대 사용하지 않는다(전체 권한 노출). 서버 전용 클라이언트는
 * `server.ts`의 createServiceRoleClient를 쓴다 (ADR-016).
 */
export function createBrowserSupabaseClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Supabase 환경변수 누락: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY (.env.local 확인)",
    );
  }
  return createClient(url, anonKey);
}
