import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ALLOWED_ADMIN_ROLES = ['Super Admin', 'Venue Admin', 'Coach', 'Personal Trainer'];

const CheckValidate = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  let isValidAdmin = false;
  try {
    const parts = token.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      const isExpired = Boolean(!payload?.exp || payload.exp * 1000 <= Date.now());
      const role = payload?.role;
      if (!isExpired && ALLOWED_ADMIN_ROLES.includes(role)) {
        isValidAdmin = true;
      }
    }
  } catch {
    isValidAdmin = false;
  }

  // The public website shares this origin/localStorage. A normal User token
  // must never unlock the partner/admin dashboard when visiting /admin.
  if (!isValidAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default CheckValidate;
