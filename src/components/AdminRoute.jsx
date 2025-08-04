import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    // Se não estiver logado, vai para o login
    return <Navigate to="/login" />;
  }

  // Se o utilizador não existir ou não tiver a função de admin, vai para o dashboard normal
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  // Se estiver logado E for admin, mostra a página de admin
  return children;
};

export default AdminRoute;