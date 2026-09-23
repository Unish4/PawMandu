import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import type { Product } from "./useProducts";

export function useProduct(slug: string | undefined) {
  return useQuery<Product>({
    queryKey: ["product", slug],
    queryFn: () => api.get(`/products/${slug}`).then((res) => res.data.product),
    enabled: !!slug,
  });
}
