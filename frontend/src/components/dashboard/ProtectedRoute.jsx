// src/components/ProtectedRoute.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user ,loading } = useAuth();
  const location = useLocation();
if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }
  if (!user) {
    // If the user is not logged in, redirect them to the login page
    // We pass the current location in the state
    // This allows us to redirect them back after they log in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the user is logged in, render the child component they are trying to access
  return children;
};

export default ProtectedRoute;