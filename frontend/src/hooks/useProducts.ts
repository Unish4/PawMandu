import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

export interface ProductImage {
  url: string;
  publicId: string;
}
export interface Product {
  _id: string;
  name: string;
  slug: string;
  species: "dog" | "cat" | "fish";
  categoryId: { _id: string; name: string; species: string } | string;
  price: number;
  stock: number;
  description?: string;
  images: ProductImage[];
  isActive: boolean;
}

export interface ProductFilters {
  species?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}


export function useProducts(
  filters: ProductFilters,
  options?: { enabled?: boolean },
) {
  return useQuery<ProductsResponse>({
    queryKey: ["products", filters],
    queryFn: () =>
      api.get("/products", { params: filters }).then((res) => res.data),
    enabled: options?.enabled ?? true,
    placeholderData: (previousData) => previousData,
  });
}
