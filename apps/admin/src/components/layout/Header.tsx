"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  Bars3Icon,
  BellIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useAdminStore } from "@/store/useAdminStore";
import { useAuth } from "@/lib/auth";
import { useState, useRef, useEffect } from "react";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/clients": "Client Management",
  "/components": "Component Management",
  "/themes": "Theme Management",
  "/form-responses": "Form Response Management",
};

function getPageTitle(pathname: string): string {
  for (const [key, value] of Object.entries(PAGE_TITLES)) {
    if (pathname === key || pathname.startsWith(key + "/")) {
      return value;
    }
  }
  return "Admin Panel";
}

export default function Header() {
  const { toggleSidebar } = useAdminStore();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pageTitle = getPageTitle(pathname);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "AD";

  return (
    <header className="admin-header">
      {/* Left: Hamburger + Page Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1 }}>
        <button
          id="header-menu-toggle"
          onClick={toggleSidebar}
          className="btn-icon-admin"
          aria-label="Toggle sidebar"
        >
          <Bars3Icon style={{ width: "18px", height: "18px" }} />
        </button>
        <h2
          style={{
            fontSize: "1rem",
            fontWeight: "600",
            color: "var(--text-primary)",
            margin: 0,
          }}
        >
          {pageTitle}
        </h2>
      </div>

      {/* Right: Notifications + User Dropdown */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {/* Notification Bell */}
        <button
          id="header-notifications"
          className="btn-icon-admin"
          aria-label="Notifications"
          style={{ position: "relative" }}
        >
          <BellIcon style={{ width: "18px", height: "18px" }} />
          <span
            style={{
              position: "absolute",
              top: "6px",
              right: "6px",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#ef4444",
              border: "2px solid white",
            }}
          />
        </button>

        {/* User Dropdown */}
        <div ref={dropdownRef} style={{ position: "relative" }}>
          <button
            id="header-user-menu"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 10px 6px 6px",
              borderRadius: "10px",
              border: "1px solid var(--border-base)",
              background: "white",
              cursor: "pointer",
              transition: "all 150ms",
            }}
          >
            <div
              className="avatar-initials"
              style={{
                background: "linear-gradient(135deg, #2563eb, #0ea5e9)",
                fontSize: "0.7rem",
              }}
            >
              {initials}
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-primary)", lineHeight: 1.2 }}>
                {user?.name || "Administrator"}
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", lineHeight: 1.2 }}>
                {user?.role || "admin"}
              </div>
            </div>
            <ChevronDownIcon
              style={{
                width: "14px",
                height: "14px",
                color: "var(--text-muted)",
                transform: dropdownOpen ? "rotate(180deg)" : "rotate(0)",
                transition: "transform 150ms",
              }}
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: "200px",
                background: "white",
                border: "1px solid var(--border-base)",
                borderRadius: "12px",
                boxShadow: "var(--shadow-lg)",
                overflow: "hidden",
                zIndex: 50,
                animation: "slideUp 150ms ease",
              }}
            >
              <div
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid var(--border-base)",
                }}
              >
                <div style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-primary)" }}>
                  {user?.name}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {user?.email}
                </div>
              </div>

              <div style={{ padding: "6px" }}>
                <button
                  id="header-profile-btn"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    color: "var(--text-primary)",
                    fontWeight: "500",
                    transition: "background 150ms",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <UserCircleIcon style={{ width: "16px", height: "16px", color: "var(--text-muted)" }} />
                  Profile
                </button>

                <button
                  id="header-logout-btn"
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: "8px",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    color: "#ef4444",
                    fontWeight: "500",
                    transition: "background 150ms",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.06)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <ArrowRightOnRectangleIcon style={{ width: "16px", height: "16px" }} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
