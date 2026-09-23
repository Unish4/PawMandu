import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/react";
import { api } from "../services/api";

export interface CurrentUser {
  _id: string;
  clerkId: string;
  email: string;
  name: string;
  phone?: string;
  role: "customer" | "admin";
}

export function useCurrentUser() {
  const { isSignedIn, userId } = useAuth();

  if (!userId) {
    throw new Error("User ID is missing");
  }

  return useQuery<CurrentUser>({
    queryKey: ["currentUser", userId],
    queryFn: () => api.get("/users/me").then((res) => res.data.user),
    enabled: !!isSignedIn && !!userId,
  });
}
