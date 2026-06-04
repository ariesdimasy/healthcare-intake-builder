import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formResponsesApi, DEMO_MODE } from "@/lib/api";
import type { FormResponse, PaginatedResponse } from "@/types";

// ─── Demo mock data ────────────────────────────────────────────────────────────
const MOCK_RESPONSES: FormResponse[] = [
  {
    id: "demo-resp-1",
    patient: { id: "p1", name: "Budi Santoso", email: "budi@email.com" },
    website: { id: "w1", name: "RS Medikal Prima" },
    component: { id: "c1", name: "Patient Registration Form", type: "patient_form" },
    response: {
      full_name: "Budi Santoso",
      date_of_birth: "1985-03-15",
      gender: "Laki-laki",
      phone: "081234567890",
      address: "Jl. Merdeka No. 10, Jakarta",
      blood_type: "O+",
    },
    created_at: "2025-04-01T09:30:00Z",
  },
  {
    id: "demo-resp-2",
    patient: { id: "p2", name: "Siti Rahayu", email: "siti@email.com" },
    website: { id: "w1", name: "RS Medikal Prima" },
    component: { id: "c2", name: "Medical History Intake", type: "history_form" },
    response: {
      allergies: ["Penisilin", "Seafood"],
      chronic_conditions: ["Hipertensi"],
      current_medications: ["Amlodipine 5mg"],
      previous_surgeries: "Appendektomi 2018",
      family_history: "Diabetes (ayah)",
    },
    created_at: "2025-04-02T10:00:00Z",
  },
  {
    id: "demo-resp-3",
    patient: { id: "p3", name: "Ahmad Fauzi", email: "ahmad@email.com" },
    website: { id: "w2", name: "Klinik Sehat Sentosa" },
    component: { id: "c3", name: "Informed Consent", type: "consent_form" },
    response: {
      patient_name: "Ahmad Fauzi",
      procedure: "Pencabutan gigi",
      consent_given: true,
      signature_date: "2025-04-03",
      witness_name: "Dr. Hendra",
    },
    created_at: "2025-04-03T11:15:00Z",
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
        JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
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

interface UseFormResponsesParams {
  page?: number;
  per_page?: number;
  search?: string;
  website_id?: string;
}

export function useFormResponses(params: UseFormResponsesParams = {}) {
  return useQuery<PaginatedResponse<FormResponse>>({
    queryKey: ["form-responses", params],
    queryFn: async () => {
      if (DEMO_MODE) {
        let data = MOCK_RESPONSES;
        if (params.website_id) {
          data = data.filter((r) => r.website?.id === params.website_id);
        }
        return mockPaginated(data, params.page, params.per_page, params.search);
      }
      const res = await formResponsesApi.list(params);
      return res.data;
    },
  });
}

export function useFormResponse(id: string) {
  return useQuery<FormResponse>({
    queryKey: ["form-responses", id],
    queryFn: async () => {
      if (DEMO_MODE) {
        const found = MOCK_RESPONSES.find((r) => r.id === id);
        if (!found) throw new Error("Form response not found");
        return found;
      }
      const res = await formResponsesApi.getById(id);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useDeleteFormResponse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (DEMO_MODE) {
        const idx = MOCK_RESPONSES.findIndex((r) => r.id === id);
        if (idx !== -1) MOCK_RESPONSES.splice(idx, 1);
        return;
      }
      await formResponsesApi.delete(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["form-responses"] }),
  });
}
