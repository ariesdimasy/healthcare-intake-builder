"use client";

import { useAuth } from "@/lib/auth";
import { useClientStore } from "@/store/useClientStore";
import { Bars3Icon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

export default function Header() {
  const { toggleSidebar } = useClientStore();
  const { user, logout, isDemoMode } = useAuth();

  return (
    <header className="admin-header">
      <button onClick={toggleSidebar} className="btn-icon-admin" title="Toggle Sidebar">
        <Bars3Icon style={{ width: "20px", height: "20px" }} />
      </button>

      <div style={{ flex: 1 }}></div>

      {isDemoMode && (
        <div style={{
          background: "rgba(245, 158, 11, 0.1)",
          color: "#d97706",
          padding: "4px 10px",
          borderRadius: "6px",
          fontSize: "0.75rem",
          fontWeight: 600,
          border: "1px solid rgba(245, 158, 11, 0.2)",
          display: "flex",
          alignItems: "center",
          gap: "6px"
        }}>
          <span style={{width: 6, height: 6, borderRadius: "50%", background: "#f59e0b"}} />
          DEMO MODE
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingLeft: "16px", borderLeft: "1px solid var(--border-base)" }}>
        <div style={{ textAlign: "right", display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.2 }}>
            {user?.name || "Loading..."}
          </span>
          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "capitalize" }}>
            {user?.role || "user"}
          </span>
        </div>
        <div className="avatar-initials" style={{ background: "var(--brand-primary)" }}>
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <button
          onClick={() => logout()}
          className="btn-icon-admin danger"
          style={{ marginLeft: "8px" }}
          title="Logout"
        >
          <ArrowRightOnRectangleIcon style={{ width: "20px", height: "20px" }} />
        </button>
      </div>
    </header>
  );
}
