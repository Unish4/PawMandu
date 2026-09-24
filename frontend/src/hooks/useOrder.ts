import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

export interface Order {
  _id: string;
  orderNumber: string;
  items: { productId: string; name: string; price: number; quantity: number }[];
  address: {
    label: string;
    city: string;
    area: string;
    landmark?: string;
    phone: string;
  };
  deliveryInstructions?: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  orderStatus: "placed" | "processing" | "delivered" | "cancelled";
  paymentStatus: "pending" | "verified";
  createdAt: string;
}

export function useOrder(id: string | undefined) {
  return useQuery<Order>({
    queryKey: ["order", id],
    queryFn: () => api.get(`/orders/${id}`).then((res) => res.data.order),
    enabled: !!id,
  });
}
