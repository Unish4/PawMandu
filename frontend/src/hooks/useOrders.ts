import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import type { Order } from "./useOrder";

interface OrdersResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useOrders(orderStatus?: string, page: number = 1) {
  return useQuery<OrdersResponse>({
    queryKey: ["orders", orderStatus, page],
    queryFn: () =>
      api
        .get("/orders", {
          params: {
            ...(orderStatus ? { orderStatus } : {}),
            page,
          },
        })
        .then((res) => res.data),
  });
}
