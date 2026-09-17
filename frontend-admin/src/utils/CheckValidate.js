import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const CheckValidate = () => {
  const navigate = useNavigate();



  useEffect(() => {
    const token = localStorage.getItem('token');
    let expired = false;
    try {
      const payload = token ? JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))) : null;
      expired = !payload?.exp || payload.exp * 1000 <= Date.now();
    } catch {
      expired = true;
    }
    if (!token || expired) {
      localStorage.removeItem('token');
      localStorage.removeItem('id');
      localStorage.removeItem('role');
      navigate('/');
    }
  }, [navigate]);

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default CheckValidate;
