import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { componentsApi, DEMO_MODE } from "@/lib/api";
import type { Component, PaginatedResponse } from "@/types";

// ─── Demo mock data ────────────────────────────────────────────────────────────
const MOCK_COMPONENTS: Component[] = [
  {
    id: "demo-comp-1",
    name: "Patient Registration Form",
    type: "patient_form",
    description: "Formulir pendaftaran pasien baru dengan data demografis lengkap.",
    position: 1,
    created_at: "2025-01-05T08:00:00Z",
    updated_at: "2025-01-05T08:00:00Z",
  },
  {
    id: "demo-comp-2",
    name: "Medical History Intake",
    type: "history_form",
    description: "Form riwayat penyakit, alergi, dan obat-obatan yang sedang dikonsumsi.",
    position: 2,
    created_at: "2025-01-06T09:00:00Z",
    updated_at: "2025-01-06T09:00:00Z",
  },
  {
    id: "demo-comp-3",
    name: "Informed Consent",
    type: "consent_form",
    description: "Formulir persetujuan tindakan medis dari pasien atau wali.",
    position: 3,
    created_at: "2025-01-07T10:00:00Z",
    updated_at: "2025-01-07T10:00:00Z",
  },
  {
    id: "demo-comp-4",
    name: "Vital Signs Record",
    type: "vital_sign_form",
    description: "Pencatatan tanda-tanda vital: tekanan darah, suhu, nadi, pernapasan.",
    position: 4,
    created_at: "2025-01-08T11:00:00Z",
    updated_at: "2025-01-08T11:00:00Z",
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

interface UseComponentsParams {
  page?: number;
  per_page?: number;
  search?: string;
}

export function useComponents(params: UseComponentsParams = {}) {
  return useQuery<PaginatedResponse<Component>>({
    queryKey: ["components", params],
    queryFn: async () => {
      if (DEMO_MODE) {
        return mockPaginated(MOCK_COMPONENTS, params.page, params.per_page, params.search);
      }
      const res = await componentsApi.list(params);
      return res.data;
    },
  });
}

export function useComponent(id: string) {
  return useQuery<Component>({
    queryKey: ["components", id],
    queryFn: async () => {
      if (DEMO_MODE) {
        const found = MOCK_COMPONENTS.find((c) => c.id === id);
        if (!found) throw new Error("Component not found");
        return found;
      }
      const res = await componentsApi.getById(id);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateComponent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      type: string;
      description: string;
      position: number;
    }) => {
      if (DEMO_MODE) {
        const newComp: Component = {
          id: `demo-comp-${Date.now()}`,
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        MOCK_COMPONENTS.push(newComp);
        return newComp;
      }
      const res = await componentsApi.create(data);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["components"] }),
  });
}

export function useUpdateComponent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: { name?: string; type?: string; description?: string; position?: number };
    }) => {
      if (DEMO_MODE) {
        const idx = MOCK_COMPONENTS.findIndex((c) => c.id === id);
        if (idx !== -1) {
          MOCK_COMPONENTS[idx] = { ...MOCK_COMPONENTS[idx], ...data, updated_at: new Date().toISOString() };
        }
        return MOCK_COMPONENTS[idx];
      }
      const res = await componentsApi.update(id, data);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["components"] }),
  });
}

export function useDeleteComponent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (DEMO_MODE) {
        const idx = MOCK_COMPONENTS.findIndex((c) => c.id === id);
        if (idx !== -1) MOCK_COMPONENTS.splice(idx, 1);
        return;
      }
      await componentsApi.delete(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["components"] }),
  });
}
