// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "client" | "doctor" | "patient";
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  user: User;
  accessToken: string;
}

// ─── Client ───────────────────────────────────────────────────────────────────
export interface Client {
  id: string;
  name: string;
  email: string;
  role: "client";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateClientPayload {
  name: string;
  email: string;
  password: string;
}

export interface UpdateClientPayload {
  name?: string;
  email?: string;
  is_active?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────
export interface Component {
  id: string;
  name: string;
  type: string;
  description: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface CreateComponentPayload {
  name: string;
  type: string;
  description: string;
  position: number;
}

export interface UpdateComponentPayload {
  name?: string;
  type?: string;
  description?: string;
  position?: number;
}

// ─── Theme ────────────────────────────────────────────────────────────────────
export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
  preview_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export interface CreateThemePayload {
  name: string;
  colors: ThemeColors;
}

export interface UpdateThemePayload {
  name?: string;
  colors?: Partial<ThemeColors>;
}

// ─── Form Response ────────────────────────────────────────────────────────────
export interface FormResponse {
  id: string;
  website_id: string;
  component_id: string;
  patient_id: string;
  response: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  website?: { name: string };
  patient?: { name: string; email: string };
  component?: { name: string; type: string };
}

// ─── API ──────────────────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface ApiError {
  message: string;
  detail?: string;
  status: number;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export interface DashboardStats {
  total_clients: number;
  total_components: number;
  total_themes: number;
  total_form_responses: number;
}
