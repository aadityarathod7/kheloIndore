import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { all_routes } from "./all_routes";

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token");

  let isValidSession = false;
  try {
    const encodedPayload = token?.split(".")[1];
    const payload = encodedPayload
      ? JSON.parse(atob(encodedPayload.replace(/-/g, "+").replace(/_/g, "/")))
      : null;
    isValidSession = Boolean(payload?.exp && payload.exp * 1000 > Date.now());
  } catch {
    isValidSession = false;
  }

  if (!isValidSession) {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    return <Navigate to={all_routes.login} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
