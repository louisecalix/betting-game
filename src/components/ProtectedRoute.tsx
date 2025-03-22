import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSocket } from '../services/SocketContext';  // Adjust path as needed

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useSocket() || {};

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render the desired component if authenticated
  return <Outlet />;
};

export default ProtectedRoute;