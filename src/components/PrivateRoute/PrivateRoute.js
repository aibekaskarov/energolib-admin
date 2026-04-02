import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <div style={{ color: '#fff', padding: 40 }}>Загрузка...</div>;
  if (!isAuthenticated || !isAdmin) return <Navigate to="/login" replace />;

  return children;
};

export default PrivateRoute;
