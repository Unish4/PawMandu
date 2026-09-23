import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  species: "dog" | "cat" | "fish";
}

export function useCategories(species?: string) {
  return useQuery<Category[]>({
    queryKey: ["categories", species],
    queryFn: () =>
      api
        .get("/categories", { params: species ? { species } : {} })
        .then((res) => res.data.categories),
    enabled: !!species,
  });
}
