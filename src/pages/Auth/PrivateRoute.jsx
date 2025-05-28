import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProgressRing from '../../components/ProgressRing';

function PrivateRoute({ children,currentRoute }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8">
          <ProgressRing />
        </div>
      </div>
    );
  }

  //if (!isAuthenticated) {
    //return <Navigate to="/login" state={{ from: location }} replace />;
  //}

  return children;
}

export default PrivateRoute;