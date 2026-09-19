import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { all_routes } from "./all_routes";
import { getCustomerToken } from "../../utils/customerAuth";

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const token = getCustomerToken();
  const isValidSession = Boolean(token);

  if (!isValidSession) {
    // Do not clear the shared key: it may belong to the separately scoped
    // admin dashboard on this same domain.
    const target = location.pathname + location.search;
    return <Navigate to={all_routes.login} state={{ URL: target, returnTo: target, from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
