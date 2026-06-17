import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * 세션 갱신 미들웨어 — @supabase/ssr 공식 패턴.
 *
 * 매 요청마다 getUser()로 인증 쿠키를 갱신하고, 갱신된 Set-Cookie를 담은 **그 response**를
 * 그대로 반환해야 한다(다른 NextResponse를 새로 만들어 반환하면 간헐적 로그아웃 발생).
 * createServerClient 생성과 getUser() 호출 사이에는 어떤 로직도 넣지 않는다.
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  // 정적 자산·이미지·favicon은 세션 갱신에서 제외(불필요한 Supabase 왕복 방지).
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
