import { useQuery } from "@tanstack/react-query";
import { dashboardApi, DEMO_MODE } from "@/lib/api";
import { DashboardStats } from "@/types";

const mockDashboardStats: DashboardStats = {
  total_websites: 3,
  total_responses: 154,
  recent_websites: [
    {
      id: "w-1",
      name: "Klinik Sehat Bersama",
      website_url: "sehat-bersama.intake.com",
      user_id: "demo-client-001",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "w-2",
      name: "Apotek Medika Utama",
      website_url: "medika-utama.intake.com",
      user_id: "demo-client-001",
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ],
  recent_responses: [
    {
      id: "resp-1",
      patient_id: "pat-123",
      website_id: "w-1",
      component_id: "comp-1",
      response: { name: "Budi Santoso", age: 34 },
      created_at: new Date().toISOString(),
      patient: { name: "Budi Santoso", email: "budi@example.com" },
      website: { name: "Klinik Sehat Bersama" },
      component: { name: "Patient Intake Form", type: "intake_form" },
    },
  ],
};

export const useDashboard = () => {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      if (DEMO_MODE) {
        return new Promise((resolve) => setTimeout(() => resolve(mockDashboardStats), 500));
      }
      const { data } = await dashboardApi.getStats();
      return data;
    },
  });
};
