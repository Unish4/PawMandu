import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import type { Order } from "./useOrder";

interface CheckoutInput {
  addressId: string;
  deliveryInstructions?: string;
}

export function useCheckout() {
  const queryClient = useQueryClient();
  const [idempotencyKey] = useState(() => crypto.randomUUID());

  return useMutation({
    mutationFn: (input: CheckoutInput) =>
      api
        .post("/orders", { ...input, idempotencyKey })
        .then((res) => res.data.order as Order),
    onSuccess: () => {
      queryClient.setQueryData(["cart"], undefined);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
