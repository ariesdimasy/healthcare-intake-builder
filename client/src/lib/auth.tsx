"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { useClientStore } from "@/store/useClientStore";
import type { User } from "@/types";

// ─── Demo Mode ────────────────────────────────────────────────────────────────
// Saat backend belum siap, gunakan credentials ini untuk preview UI:
//   Email    : client@healthcareintake.com
//   Password : client123
// Set NEXT_PUBLIC_DEMO_MODE=false saat backend sudah aktif.
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

const DEMO_USER: User = {
  id: "demo-client-001",
  name: "Client Administrator",
  email: "client@healthcareintake.com",
  role: "client",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const DEMO_CREDENTIALS = {
  email: "client@healthcareintake.com",
  password: "client123",
};

// ─── Auth Context ─────────────────────────────────────────────────────────────
interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, setUser, setAccessToken, logout: storeLogout } = useClientStore();
  const [isLoading, setIsLoading] = useState(true);

  // On mount: verify existing token (or restore demo session)
  useEffect(() => {
    const token = localStorage.getItem("client_access_token");

    if (DEMO_MODE && token === "demo-client-token") {
      // Restore demo session
      setUser(DEMO_USER);
      setIsLoading(false);
      return;
    }

    if (token && !DEMO_MODE) {
      authApi
        .me()
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          storeLogout();
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [setUser, storeLogout]);

  const login = async (email: string, password: string) => {
    // ── Demo Mode Login ──────────────────────────────────────────────────────
    if (DEMO_MODE) {
      if (
        email === DEMO_CREDENTIALS.email &&
        password === DEMO_CREDENTIALS.password
      ) {
        setAccessToken("demo-client-token");
        setUser(DEMO_USER);
        router.push("/dashboard");
        return;
      }
      throw new Error("Credentials demo salah.");
    }

    // ── Real Backend Login ───────────────────────────────────────────────────
    const res = await authApi.login({ email, password });
    const { access_token, user: userData } = res.data;
    setAccessToken(access_token);
    setUser(userData);
    router.push("/dashboard");
  };

  const logout = async () => {
    if (!DEMO_MODE) {
      try {
        await authApi.logout();
      } catch {
        // ignore
      }
    }
    storeLogout();
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        isDemoMode: DEMO_MODE,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
