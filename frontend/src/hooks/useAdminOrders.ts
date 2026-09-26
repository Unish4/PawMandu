import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import type { Order } from "./useOrder";

interface AdminOrdersResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useAdminOrders(
  filters: { orderStatus?: string; limit?: number },
  options?: { refetchInterval?: number },
) {
  return useQuery<AdminOrdersResponse>({
    queryKey: ["admin-orders", filters],
    queryFn: () =>
      api.get("/admin/orders", { params: filters }).then((res) => res.data),
    refetchInterval: options?.refetchInterval,
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) =>
      api
        .patch(`/admin/orders/${orderId}/verify-payment`)
        .then((res) => res.data.order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderId,
      orderStatus,
    }: {
      orderId: string;
      orderStatus: string;
    }) =>
      api
        .patch(`/admin/orders/${orderId}/status`, { orderStatus })
        .then((res) => res.data.order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] });
    },
  });
}
