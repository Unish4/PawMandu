import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import type { ProfileFormValues } from "../schemas/profileSchema";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProfileFormValues) =>
      api.patch("/users/me", data).then((res) => res.data.user),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["currentUser"] }),
  });
}
