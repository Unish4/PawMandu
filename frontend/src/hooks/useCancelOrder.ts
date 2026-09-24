import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) =>
      api.patch(`/orders/${orderId}/cancel`).then((res) => res.data.order),
    onSuccess: (order) => {
      queryClient.setQueryData(["order", order._id], order);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
