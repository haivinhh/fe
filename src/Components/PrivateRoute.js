import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Element }) => {
  const isAuthenticated = useSelector((state) => state.auth.login?.currentUser);
  
  return isAuthenticated ? <Element /> : <Navigate to="/admin" />;
};

export default PrivateRoute;
