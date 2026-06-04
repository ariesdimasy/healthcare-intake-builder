"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { useAdminStore } from "@/store/useAdminStore";
import type { User } from "@/types";

// ─── Demo Mode ────────────────────────────────────────────────────────────────
// Saat backend belum siap, gunakan credentials ini untuk preview UI:
//   Email    : admin@healthcareintake.com
//   Password : admin123
// Set NEXT_PUBLIC_DEMO_MODE=false saat backend sudah aktif.
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

const DEMO_USER: User = {
  id: "demo-admin-001",
  name: "System Administrator",
  email: "admin@healthcareintake.com",
  role: "admin",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const DEMO_CREDENTIALS = {
  email: "admin@healthcareintake.com",
  password: "admin123",
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
  const { user, setUser, setAccessToken, logout: storeLogout } = useAdminStore();
  const [isLoading, setIsLoading] = useState(true);

  // On mount: verify existing token (or restore demo session)
  useEffect(() => {
    const token = localStorage.getItem("admin_access_token");

    if (DEMO_MODE && token === "demo-token") {
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
        setAccessToken("demo-token");
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
