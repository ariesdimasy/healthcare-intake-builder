import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { themesApi, DEMO_MODE } from "@/lib/api";
import type { Theme, PaginatedResponse } from "@/types";

// ─── Demo mock data ────────────────────────────────────────────────────────────
const MOCK_THEMES: Theme[] = [
  {
    id: "demo-theme-1",
    name: "Healthcare Blue",
    colors: {
      primary: "#2563eb",
      secondary: "#0ea5e9",
      accent: "#06b6d4",
      background: "#f0f9ff",
      text: "#0f172a",
    },
    created_at: "2025-01-10T08:00:00Z",
    updated_at: "2025-01-10T08:00:00Z",
  },
  {
    id: "demo-theme-2",
    name: "Medical Green",
    colors: {
      primary: "#059669",
      secondary: "#10b981",
      accent: "#34d399",
      background: "#f0fdf4",
      text: "#064e3b",
    },
    created_at: "2025-02-01T09:00:00Z",
    updated_at: "2025-02-01T09:00:00Z",
  },
  {
    id: "demo-theme-3",
    name: "Clinical Purple",
    colors: {
      primary: "#7c3aed",
      secondary: "#8b5cf6",
      accent: "#a78bfa",
      background: "#faf5ff",
      text: "#1e1b4b",
    },
    created_at: "2025-02-15T10:00:00Z",
    updated_at: "2025-02-15T10:00:00Z",
  },
];

function mockPaginated<T>(
  data: T[],
  page = 1,
  perPage = 10,
  search = ""
): PaginatedResponse<T> {
  const filtered = search
    ? (data as Record<string, unknown>[]).filter((item) =>
        Object.values(item).some((v) =>
          String(v).toLowerCase().includes(search.toLowerCase())
        )
      ) as T[]
    : data;
  const start = (page - 1) * perPage;
  return {
    data: filtered.slice(start, start + perPage),
    total: filtered.length,
    page,
    per_page: perPage,
    total_pages: Math.ceil(filtered.length / perPage),
  };
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

interface UseThemesParams {
  page?: number;
  per_page?: number;
  search?: string;
}

export function useThemes(params: UseThemesParams = {}) {
  return useQuery<PaginatedResponse<Theme>>({
    queryKey: ["themes", params],
    queryFn: async () => {
      if (DEMO_MODE) {
        return mockPaginated(MOCK_THEMES, params.page, params.per_page, params.search);
      }
      const res = await themesApi.list(params);
      return res.data;
    },
  });
}

export function useTheme(id: string) {
  return useQuery<Theme>({
    queryKey: ["themes", id],
    queryFn: async () => {
      if (DEMO_MODE) {
        const found = MOCK_THEMES.find((t) => t.id === id);
        if (!found) throw new Error("Theme not found");
        return found;
      }
      const res = await themesApi.getById(id);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateTheme() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; colors: Theme["colors"] }) => {
      if (DEMO_MODE) {
        const newTheme: Theme = {
          id: `demo-theme-${Date.now()}`,
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        MOCK_THEMES.push(newTheme);
        return newTheme;
      }
      const res = await themesApi.create(data);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["themes"] }),
  });
}

export function useUpdateTheme() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: { name?: string; colors?: Theme["colors"] };
    }) => {
      if (DEMO_MODE) {
        const idx = MOCK_THEMES.findIndex((t) => t.id === id);
        if (idx !== -1) {
          MOCK_THEMES[idx] = { ...MOCK_THEMES[idx], ...data, updated_at: new Date().toISOString() };
        }
        return MOCK_THEMES[idx];
      }
      const res = await themesApi.update(id, data);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["themes"] }),
  });
}

export function useDeleteTheme() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (DEMO_MODE) {
        const idx = MOCK_THEMES.findIndex((t) => t.id === id);
        if (idx !== -1) MOCK_THEMES.splice(idx, 1);
        return;
      }
      await themesApi.delete(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["themes"] }),
  });
}
