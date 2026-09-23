import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import type { AddressFormValues } from "../schemas/addressSchema";

export interface Address extends AddressFormValues {
  _id: string;
}

export function useAddresses() {
  return useQuery<Address[]>({
    queryKey: ["addresses"],
    queryFn: () => api.get("/addresses").then((res) => res.data.addresses),
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddressFormValues) =>
      api.post("/addresses", data).then((res) => res.data.address),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AddressFormValues }) =>
      api.patch(`/addresses/${id}`, data).then((res) => res.data.address),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/addresses/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses"] }),
  });
}
