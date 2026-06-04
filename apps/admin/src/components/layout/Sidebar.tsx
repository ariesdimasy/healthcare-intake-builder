"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HomeIcon,
  UsersIcon,
  PuzzlePieceIcon,
  SwatchIcon,
  ClipboardDocumentListIcon,
  ShieldCheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useAdminStore } from "@/store/useAdminStore";

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: HomeIcon },
    ],
  },
  {
    label: "Management",
    items: [
      { href: "/clients", label: "Client Management", icon: UsersIcon },
      { href: "/components", label: "Component Management", icon: PuzzlePieceIcon },
      { href: "/themes", label: "Theme Management", icon: SwatchIcon },
      { href: "/form-responses", label: "Form Responses", icon: ClipboardDocumentListIcon },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useAdminStore();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className="sidebar"
        style={{
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {/* Logo */}
        <div className="sidebar-logo">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #2563eb, #0ea5e9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 4px 10px rgba(37,99,235,0.4)",
              }}
            >
              <ShieldCheckIcon style={{ width: "20px", height: "20px", color: "white" }} />
            </div>
            <div>
              <div
                style={{
                  fontSize: "0.9rem",
                  fontWeight: "700",
                  color: "#f1f5f9",
                  lineHeight: 1.2,
                  letterSpacing: "-0.01em",
                }}
              >
                HealthAdmin
              </div>
              <div style={{ fontSize: "0.65rem", color: "rgba(241,245,249,0.45)", fontWeight: 500 }}>
                Intake Builder
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <div className="sidebar-section-label">{section.label}</div>
              {section.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`sidebar-nav-item ${active ? "active" : ""}`}
                    id={`nav-${item.href.replace("/", "")}`}
                  >
                    <item.icon className="icon" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Collapse button */}
        <div
          style={{
            padding: "16px 12px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <button
            onClick={toggleSidebar}
            id="sidebar-toggle"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 12px",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.06)",
              border: "none",
              color: "rgba(241,245,249,0.55)",
              cursor: "pointer",
              fontSize: "0.8rem",
              width: "100%",
              transition: "all 150ms",
            }}
          >
            <ChevronLeftIcon style={{ width: "16px", height: "16px" }} />
            <span>Collapse</span>
          </button>
        </div>
      </aside>

      {/* Floating expand button when collapsed */}
      {!sidebarOpen && (
        <button
          onClick={toggleSidebar}
          id="sidebar-expand"
          style={{
            position: "fixed",
            left: "16px",
            top: "18px",
            zIndex: 40,
            width: "36px",
            height: "36px",
            borderRadius: "8px",
            background: "#0f172a",
            border: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "#f1f5f9",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          <ChevronRightIcon style={{ width: "16px", height: "16px" }} />
        </button>
      )}
    </>
  );
}
