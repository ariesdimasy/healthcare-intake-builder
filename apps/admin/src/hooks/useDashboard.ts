import { useQuery } from "@tanstack/react-query";
import { dashboardApi, DEMO_MODE } from "@/lib/api";
import type { DashboardStats } from "@/types";

const MOCK_STATS: DashboardStats = {
  total_clients: 3,
  total_components: 4,
  total_themes: 3,
  total_form_responses: 3,
};

export function useDashboard() {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      if (DEMO_MODE) return MOCK_STATS;
      const res = await dashboardApi.getStats();
      return res.data;
    },
  });
}
