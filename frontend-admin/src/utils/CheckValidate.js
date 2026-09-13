import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const CheckValidate = () => {
  const navigate = useNavigate();



  useEffect(() => {
    const token = localStorage.getItem('token');
    let expired = false;
    let role = '';
    try {
      const payload = token ? JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))) : null;
      expired = !payload?.exp || payload.exp * 1000 <= Date.now();
      role = payload?.role || '';
    } catch {
      expired = true;
    }
    if (!token || expired) {
      localStorage.removeItem('token');
      localStorage.removeItem('id');
      localStorage.removeItem('role');
      navigate('/');
      return;
    }

    // The public website shares this origin/localStorage. A normal User token
    // must never unlock the partner/admin dashboard just by visiting /admin.
    if (!['Super Admin', 'Venue Admin', 'Coach', 'Personal Trainer'].includes(role)) {
      window.location.replace('/');
    }
  }, [navigate]);

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default CheckValidate;
