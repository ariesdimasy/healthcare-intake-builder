"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  GlobeAltIcon,
  SwatchIcon,
  DocumentTextIcon,
  ViewColumnsIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { useClientStore } from "@/store/useClientStore";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { label: "Websites", href: "/websites", icon: GlobeAltIcon },
  { label: "Components", href: "/components", icon: ViewColumnsIcon },
  { label: "Themes", href: "/themes", icon: SwatchIcon },
  { label: "Form Responses", href: "/form-responses", icon: DocumentTextIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen } = useClientStore();

  return (
    <aside
      className="sidebar"
      style={{
        transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
      }}
    >
      <div className="sidebar-logo">
        <h2 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#f8fafc", margin: 0, letterSpacing: "-0.03em" }}>
          Client Portal
        </h2>
        <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: "2px 0 0" }}>
          Intake Builder
        </p>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Main Menu</div>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-nav-item ${isActive ? "active" : ""}`}
            >
              <item.icon className="icon" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <Link href="/settings" className="sidebar-nav-item">
          <Cog6ToothIcon className="icon" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
