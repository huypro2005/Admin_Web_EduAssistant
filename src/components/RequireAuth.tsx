import { Navigate, Outlet } from "react-router-dom";
import { hasRefreshToken } from "../auth/tokens";

export function RequireAuth() {
  if (!hasRefreshToken()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

