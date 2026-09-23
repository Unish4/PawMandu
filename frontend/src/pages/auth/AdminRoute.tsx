import { useUser } from "@clerk/react";
import { Navigate, Outlet } from "react-router";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function AdminRoute() {
  const { isLoaded, isSignedIn } = useUser();
  const { data, isLoading } = useCurrentUser();

  if (!isLoaded || (isSignedIn && isLoading)) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isSignedIn) return <Navigate to="/sign-in" replace />;
  if (data?.role !== "admin") return <Navigate to="/" replace />;

  return <Outlet />;
}
