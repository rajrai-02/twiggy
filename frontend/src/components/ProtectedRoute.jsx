import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Guards a route by checking if the user session exists.
 * If not logged in, redirects to /login.
 * If role is specified, also checks the user's role.
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const user = JSON.parse(sessionStorage.getItem('user') || 'null');

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect to their own dashboard if they hit the wrong one
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  return children;
};

export default ProtectedRoute;
