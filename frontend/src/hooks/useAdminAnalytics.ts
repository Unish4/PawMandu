import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

export interface DailyStat {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  _id: string;
  name: string;
  quantity: number;
  revenue: number;
}

interface AnalyticsResponse {
  dailyStats: DailyStat[];
  topProductsByQuantity: TopProduct[];
  topProductsByRevenue: TopProduct[];
}

export function useAdminAnalytics(days: number) {
  return useQuery<AnalyticsResponse>({
    queryKey: ["admin-analytics", days],
    queryFn: () =>
      api
        .get("/admin/dashboard/analytics", { params: { days } })
        .then((res) => res.data.analytics),
  });
}
