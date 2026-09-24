import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/react";
import { api } from "../services/api";

export interface ProductImage {
  url: string;
  publicId: string;
}

export interface CartItemResolved {
  productId: string;
  quantity: number;
  product: {
    name: string;
    price: number;
    stock: number;
    slug: string;
    images: { url: string; publicId: string }[];
  } | null;
  issue: "unavailable" | "insufficient_stock" | null;
}

export interface CartResponse {
  items: CartItemResolved[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export function useCart() {
  const { isSignedIn } = useAuth();
  return useQuery<CartResponse>({
    queryKey: ["cart"],
    queryFn: () => api.get("/cart").then((res) => res.data.cart),
    enabled: isSignedIn,
  });
}

export function useCartQuantity(productId: string): number {
  const { data: cart } = useCart();
  return cart?.items.find((i) => i.productId === productId)?.quantity ?? 0;
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) =>
      api
        .post("/cart/items", { productId, quantity })
        .then((res) => res.data.cart),
    onSuccess: (cart) => queryClient.setQueryData(["cart"], cart),
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) =>
      api
        .patch(`/cart/items/${productId}`, { quantity })
        .then((res) => res.data.cart),
    onSuccess: (cart) => queryClient.setQueryData(["cart"], cart),
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) =>
      api.delete(`/cart/items/${productId}`).then((res) => res.data.cart),
    onSuccess: (cart) => queryClient.setQueryData(["cart"], cart),
  });
}
