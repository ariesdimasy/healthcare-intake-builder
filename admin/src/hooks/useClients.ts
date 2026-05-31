import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientsApi, DEMO_MODE } from "@/lib/api";
import type { Client, PaginatedResponse } from "@/types";

// ─── Demo mock data ────────────────────────────────────────────────────────────
const MOCK_CLIENTS: Client[] = [
  {
    id: "demo-client-1",
    name: "RS Medikal Prima",
    email: "admin@rsmedikal.com",
    role: "client",
    is_active: true,
    created_at: "2025-01-10T08:00:00Z",
    updated_at: "2025-01-10T08:00:00Z",
  },
  {
    id: "demo-client-2",
    name: "Klinik Sehat Sentosa",
    email: "info@kliniksehat.com",
    role: "client",
    is_active: true,
    created_at: "2025-02-15T09:30:00Z",
    updated_at: "2025-03-01T11:00:00Z",
  },
  {
    id: "demo-client-3",
    name: "Puskesmas Kecamatan Barat",
    email: "pkm.barat@gov.id",
    role: "client",
    is_active: false,
    created_at: "2024-12-01T07:00:00Z",
    updated_at: "2024-12-20T10:15:00Z",
  },
];

// ─── Helper ────────────────────────────────────────────────────────────────────
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

interface UseClientsParams {
  page?: number;
  per_page?: number;
  search?: string;
}

export function useClients(params: UseClientsParams = {}) {
  return useQuery<PaginatedResponse<Client>>({
    queryKey: ["clients", params],
    queryFn: async () => {
      if (DEMO_MODE) {
        return mockPaginated(MOCK_CLIENTS, params.page, params.per_page, params.search);
      }
      const res = await clientsApi.list(params);
      return res.data;
    },
  });
}

export function useClient(id: string) {
  return useQuery<Client>({
    queryKey: ["clients", id],
    queryFn: async () => {
      if (DEMO_MODE) {
        const found = MOCK_CLIENTS.find((c) => c.id === id);
        if (!found) throw new Error("Client not found");
        return found;
      }
      const res = await clientsApi.getById(id);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; email: string; password: string }) => {
      if (DEMO_MODE) {
        const newClient: Client = {
          id: `demo-${Date.now()}`,
          name: data.name,
          email: data.email,
          role: "client",
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        MOCK_CLIENTS.unshift(newClient);
        return newClient;
      }
      const res = await clientsApi.create(data);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clients"] }),
  });
}

export function useUpdateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: { name?: string; email?: string; is_active?: boolean };
    }) => {
      if (DEMO_MODE) {
        const idx = MOCK_CLIENTS.findIndex((c) => c.id === id);
        if (idx !== -1) {
          MOCK_CLIENTS[idx] = { ...MOCK_CLIENTS[idx], ...data, updated_at: new Date().toISOString() };
        }
        return MOCK_CLIENTS[idx];
      }
      const res = await clientsApi.update(id, data);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clients"] }),
  });
}

export function useDeleteClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (DEMO_MODE) {
        const idx = MOCK_CLIENTS.findIndex((c) => c.id === id);
        if (idx !== -1) MOCK_CLIENTS.splice(idx, 1);
        return;
      }
      await clientsApi.delete(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clients"] }),
  });
}
