import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

interface ClientStore {
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

export const useClientStore = create<ClientStore>()(
  persist(
    (set) => ({
      // Auth
      user: null,
      accessToken: null,
      setUser: (user) => set({ user }),
      setAccessToken: (accessToken) => {
        set({ accessToken });
        if (accessToken) {
          localStorage.setItem("client_access_token", accessToken);
        } else {
          localStorage.removeItem("client_access_token");
        }
      },
      logout: () => {
        set({ user: null, accessToken: null });
        localStorage.removeItem("client_access_token");
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
