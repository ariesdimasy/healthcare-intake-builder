"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useClientStore } from "@/store/useClientStore";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;

  const { sidebarOpen } = useClientStore();

  // Guard: redirect to login if not authenticated.
  // Runs ONCE on mount only — after mount we know if token exists.
  // We intentionally do NOT put `user` or `router` in deps to prevent
  // the layout from unmounting/remounting children when Zustand hydrates,
  // which would reset all local modal state in child pages.
  useEffect(() => {
    const token = localStorage.getItem("client_access_token");
    if (!token) {
      routerRef.current.replace("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div
        className="main-content"
        style={{
          marginLeft: sidebarOpen ? "var(--sidebar-width)" : "0",
          transition: "margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1)",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header />
        <main style={{ flex: 1 }}>{children}</main>
      </div>
    </div>
  );
}
