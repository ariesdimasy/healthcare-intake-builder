import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Demo mode: skip all real API calls when backend is not available
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  // Shorter timeout so failures don't block the UI for long
  timeout: 10000,
});

// ─── Request Interceptor — inject token ───────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("admin_access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor — handle auth errors ────────────────────────────────
// Only redirect on 401 when NOT in demo mode to avoid resetting page state
// when the backend is unreachable or returns an error.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!DEMO_MODE && error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("admin_access_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ─── API Helpers ──────────────────────────────────────────────────────────────

/** Dashboard */
export const dashboardApi = {
  getStats: () => apiClient.get("/api/admin/dashboard/stats"),
};

/** Clients */
export const clientsApi = {
  list: (params?: { page?: number; per_page?: number; search?: string }) =>
    apiClient.get("/api/admin/clients", { params }),
  getById: (id: string) => apiClient.get(`/api/admin/clients/${id}`),
  create: (data: { name: string; email: string; password: string }) =>
    apiClient.post("/api/admin/clients", data),
  update: (id: string, data: { name?: string; email?: string; is_active?: boolean }) =>
    apiClient.put(`/api/admin/clients/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/admin/clients/${id}`),
};

/** Components */
export const componentsApi = {
  list: (params?: { page?: number; per_page?: number; search?: string }) =>
    apiClient.get("/api/admin/components", { params }),
  getById: (id: string) => apiClient.get(`/api/admin/components/${id}`),
  create: (data: {
    name: string;
    type: string;
    description: string;
    position: number;
  }) => apiClient.post("/api/admin/components", data),
  update: (
    id: string,
    data: { name?: string; type?: string; description?: string; position?: number }
  ) => apiClient.put(`/api/admin/components/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/admin/components/${id}`),
};

/** Themes */
export const themesApi = {
  list: (params?: { page?: number; per_page?: number; search?: string }) =>
    apiClient.get("/api/admin/themes", { params }),
  getById: (id: string) => apiClient.get(`/api/admin/themes/${id}`),
  create: (data: {
    name: string;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
    };
  }) => apiClient.post("/api/admin/themes", data),
  update: (id: string, data: { name?: string; colors?: Record<string, string> }) =>
    apiClient.put(`/api/admin/themes/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/admin/themes/${id}`),
};

/** Form Responses */
export const formResponsesApi = {
  list: (params?: {
    page?: number;
    per_page?: number;
    search?: string;
    website_id?: string;
  }) => apiClient.get("/api/admin/form-responses", { params }),
  getById: (id: string) => apiClient.get(`/api/admin/form-responses/${id}`),
  delete: (id: string) => apiClient.delete(`/api/admin/form-responses/${id}`),
};

/** Auth */
export const authApi = {
  login: (data: { email: string; password: string }) =>
    apiClient.post("/api/admin/auth/login", data),
  logout: () => apiClient.post("/api/admin/auth/logout"),
  me: () => apiClient.get("/api/admin/auth/me"),
};
