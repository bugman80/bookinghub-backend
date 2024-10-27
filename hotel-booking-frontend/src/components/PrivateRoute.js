import React from 'react';
import { Navigate } from 'react-router-dom';

// Componente per gestire le rotte private
const PrivateRoute = ({ element: Component }) => {
  const isAuthenticated = !!localStorage.getItem('access');
  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;