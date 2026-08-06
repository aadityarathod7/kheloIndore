import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { all_routes } from "./all_routes";

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to={all_routes.login} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
