// src/components/auth/AuthGuard.tsx
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserRole } from '../../types';

interface AuthGuardProps {
  component: React.ComponentType<any>;
  requiredRoles: UserRole[];
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  component: Component,
  requiredRoles,
}) => {
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const currentUserStr = localStorage.getItem('currentUser');

    if (!currentUserStr) {
      setIsAuthorized(false);
      return;
    }

    try {
      const currentUser = JSON.parse(currentUserStr);
      const hasRequiredRole = requiredRoles.some((role) =>
        currentUser.roles.includes(role)
      );

      setIsAuthorized(hasRequiredRole);
    } catch (e) {
      console.error('Error parsing user data:', e);
      setIsAuthorized(false);
    }
  }, [requiredRoles]);
  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }
  if (!isAuthorized) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Component />;
};

export default AuthGuard;
