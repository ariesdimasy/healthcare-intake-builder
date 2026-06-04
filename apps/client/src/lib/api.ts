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
      const token = localStorage.getItem("client_access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor — handle auth errors ────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!DEMO_MODE && error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("client_access_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ─── API Helpers ──────────────────────────────────────────────────────────────

/** Dashboard */
export const dashboardApi = {
  getStats: () => apiClient.get("/api/client/dashboard/stats"),
};

/** Websites */
export const websitesApi = {
  list: (params?: { page?: number; per_page?: number; search?: string }) =>
    apiClient.get("/api/client/websites", { params }),
  getById: (id: string) => apiClient.get(`/api/client/websites/${id}`),
  create: (data: { name: string; website_url: string; theme_id: string }) =>
    apiClient.post("/api/client/websites", data),
  update: (id: string, data: { name?: string; website_url?: string; theme_id?: string }) =>
    apiClient.put(`/api/client/websites/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/client/websites/${id}`),
};

/** Components (List only for building forms, maybe custom components later) */
export const componentsApi = {
  list: (params?: { page?: number; per_page?: number; search?: string }) =>
    apiClient.get("/api/client/components", { params }),
  getById: (id: string) => apiClient.get(`/api/client/components/${id}`),
  create: (data: {
    name: string;
    type: string;
    description: string;
    position: number;
  }) => apiClient.post("/api/client/components", data),
  update: (
    id: string,
    data: { name?: string; type?: string; description?: string; position?: number }
  ) => apiClient.put(`/api/client/components/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/client/components/${id}`),
};

/** Themes (List only for selection) */
export const themesApi = {
  list: (params?: { page?: number; per_page?: number; search?: string }) =>
    apiClient.get("/api/client/themes", { params }),
  getById: (id: string) => apiClient.get(`/api/client/themes/${id}`),
};

/** Form Responses */
export const formResponsesApi = {
  list: (params?: {
    page?: number;
    per_page?: number;
    search?: string;
    website_id?: string;
  }) => apiClient.get("/api/client/form-responses", { params }),
  getById: (id: string) => apiClient.get(`/api/client/form-responses/${id}`),
  delete: (id: string) => apiClient.delete(`/api/client/form-responses/${id}`),
};

/** Auth */
export const authApi = {
  login: (data: { email: string; password: string }) =>
    apiClient.post("/api/client/auth/login", data),
  logout: () => apiClient.post("/api/client/auth/logout"),
  me: () => apiClient.get("/api/client/auth/me"),
};
