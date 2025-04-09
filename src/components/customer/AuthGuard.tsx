import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { UserRole } from '../../types';
import { Waves as WavesIcon } from '@mui/icons-material';

interface AuthGuardProps {
  component: React.ComponentType<any>;
  requiredRoles: UserRole[];
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  component: Component,
  requiredRoles,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      setIsAuthenticated(false);
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      if (userData && userData.roles) {
        setUserRoles(userData.roles);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      setIsAuthenticated(false);
    }
  }, []);

  if (isAuthenticated === null) {
    // Still loading
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          gap: 2,
        }}
      >
        <WavesIcon
          sx={{
            fontSize: 60,
            color: 'primary.light',
            animation: 'pulse 2s infinite',
            '@keyframes pulse': {
              '0%': {
                transform: 'scale(0.95)',
                opacity: 0.7,
              },
              '70%': {
                transform: 'scale(1.1)',
                opacity: 1,
              },
              '100%': {
                transform: 'scale(0.95)',
                opacity: 0.7,
              },
            },
          }}
        />
        <Typography color="text.secondary" variant="h6">
          Authenticating...
        </Typography>
      </Box>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  const hasRequiredRole = requiredRoles.some((role) =>
    userRoles.includes(role)
  );

  if (!hasRequiredRole) {
    // If user is admin, redirect to admin dashboard
    if (userRoles.includes(UserRole.ADMIN)) {
      return <Navigate to="/admin" replace />;
    }

    // If user is product manager, redirect to product management dashboard
    if (userRoles.includes(UserRole.PRODUCT_MANAGER)) {
      return <Navigate to="/product-management" replace />;
    }

    // If user is customer, redirect to customer dashboard
    if (userRoles.includes(UserRole.CUSTOMER)) {
      return <Navigate to="/account" replace />;
    }

    // Fallback to home
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has correct role
  return <Component />;
};

export default AuthGuard;
