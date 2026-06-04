import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

interface AdminStore {
  // Auth
  user: User | null;
  accessToken: string | null;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  logout: () => void;

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      // Auth
      user: null,
      accessToken: null,
      setUser: (user) => set({ user }),
      setAccessToken: (accessToken) => {
        set({ accessToken });
        if (accessToken) {
          localStorage.setItem("admin_access_token", accessToken);
        } else {
          localStorage.removeItem("admin_access_token");
        }
      },
      logout: () => {
        set({ user: null, accessToken: null });
        localStorage.removeItem("admin_access_token");
      },

      // Sidebar
      sidebarOpen: true,
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: "admin-store",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);
