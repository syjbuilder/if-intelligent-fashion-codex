import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * 유저 스코프 SSR 서버 클라이언트 — 라우트 핸들러·Server Component에서 사용.
 *
 * next/headers 쿠키로 세션을 읽고(getAll)·갱신한다(setAll). anon 키 + 유저 JWT 쿠키로
 * 동작하므로 RLS가 "로그인한 그 유저"로 적용된다(API_CONTRACTS: auth.uid() 추출).
 * 전체 권한(service_role) 쓰기는 `server.ts`의 createServiceRoleClient를 쓴다(ADR-016).
 *
 * OAuth 로그인 개시(signInWithOAuth)·콜백(exchangeCodeForSession)이 같은 쿠키 jar를
 * 공유해야 PKCE code-verifier가 이어진다 — 두 라우트 모두 이 클라이언트를 쓸 것.
 */
export async function createServerSupabaseClient(): Promise<SupabaseClient> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Supabase 환경변수 누락: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY (.env.local 확인)",
    );
  }
  const cookieStore = await cookies();
  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Server Component(읽기 전용)에서 호출되면 set이 throw — 미들웨어가 세션
          // 쿠키를 갱신하므로 무시해도 안전하다(공식 권장 패턴).
        }
      },
    },
  });
}
