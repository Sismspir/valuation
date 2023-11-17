import { Navigate, useNavigate, Outlet } from 'react-router-dom';
import React, { useEffect, useContext } from 'react';

const ProtectedRoutes: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = false;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  return isLoggedIn ? <Outlet /> : null;
};

export default ProtectedRoutes;
