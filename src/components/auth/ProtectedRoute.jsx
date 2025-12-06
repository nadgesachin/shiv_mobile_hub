import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';

const ProtectedRoute = ({ 
  children, 
  requireAdmin = false, 
  redirectTo = '/login',
  fallbackPath = '/dashboard'
}) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated()) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // If admin access is required but user is not admin, redirect
  if (requireAdmin && !isAdmin()) {
    return (
      <Navigate 
        to={fallbackPath} 
        state={{ 
          error: 'Admin access required',
          from: location 
        }} 
        replace 
      />
    );
  }

  // If all checks pass, render children
  return children;
};

export default ProtectedRoute;
