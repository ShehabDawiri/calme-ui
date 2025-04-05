import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import { Loader } from "../components/ui/Loader";

const ROLE_NAMESPACE = `${import.meta.env.VITE_AUTH0_AUDIENCE}/roles`;

export function InitialRedirect() {
  const { isAuthenticated, isLoading, user } = useAuth0();

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/welcome" replace />;
  }

  const roles = user?.[ROLE_NAMESPACE] || [];

  if (roles.includes("admin")) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  if (roles.includes("user")) {
    return <Navigate to="/chat" replace />;
  }

  // ✅ Fallback: Authenticated but no matching role
  return (
    <div className="flex h-screen items-center justify-center bg-[var(--color-primary-100)]">
      <h1 className="text-2xl font-semibold text-[var(--color-primary-500)]">
        No valid role assigned. Please contact support.
      </h1>
    </div>
  );
}
