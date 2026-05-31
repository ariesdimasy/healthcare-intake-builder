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

// ─── Website ──────────────────────────────────────────────────────────────────
export interface Website {
  id: string;
  name: string;
  website_url: string;
  user_id: string;
  theme_id?: string;
  theme?: Theme;
  components?: Component[];
  created_at: string;
  updated_at: string;
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

// ─── Form Response ────────────────────────────────────────────────────────────
export interface FormResponse {
  id: string;
  website_id?: string;
  component_id?: string;
  patient_id?: string;
  response: Record<string, unknown>;
  created_at: string;
  updated_at?: string;
  website?: { id?: string; name: string };
  patient?: { id?: string; name: string; email: string };
  component?: { id?: string; name: string; type: string };
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
  total_websites: number;
  total_responses: number;
  recent_websites?: Website[];
  recent_responses?: FormResponse[];
}

// ─── Navigation ───────────────────────────────────────────────────────────────
export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string, style?: React.CSSProperties }>;
  badge?: number;
}
