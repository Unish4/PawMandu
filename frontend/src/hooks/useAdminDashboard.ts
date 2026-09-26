import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

interface DashboardStats {
  ordersToday: number;
  revenueToday: number;
  pendingVerifications: number;
  lowStockCount: number;
}

export function useAdminDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["admin-dashboard-stats"],
    queryFn: () => api.get("/admin/dashboard/stats").then((res) => res.data.stats),
    refetchInterval: 20000,
  });
}
