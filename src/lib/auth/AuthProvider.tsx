"use client";

import { createContext, useContext, useMemo } from "react";

export type AuthUser = { id: string; email: string | null };

type AuthValue = { user: AuthUser | null; isLoggedIn: boolean };

/**
 * 기본값은 throw하지 않는 비로그인 상태 — provider로 감싸지 않은 컴포넌트/테스트가
 * useAuth()를 안전하게 호출할 수 있다(기존 무-provider 페이지 테스트 보호).
 */
const AuthContext = createContext<AuthValue>({ user: null, isLoggedIn: false });

export function AuthProvider({
  initialUser,
  children,
}: {
  initialUser: AuthUser | null;
  children: React.ReactNode;
}) {
  const value = useMemo<AuthValue>(
    () => ({ user: initialUser, isLoggedIn: initialUser !== null }),
    [initialUser],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  return useContext(AuthContext);
}
