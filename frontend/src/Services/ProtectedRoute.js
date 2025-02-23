import { Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const ProtectedRoute = ({ children }) => {
  // Access the authentication state from the AuthContext
  const { isAuthenticated } = useContext(AuthContext);

  // Get the current location using useLocation hook
  const location = useLocation();

   // Check if the user is not authenticated
  if (!isAuthenticated) {
    // Redirect to the login page, preserving the original route
    // 'replace' ensures that the current location is replaced in the history stack
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If the user is authenticated, render the children components
  return children;
};

export default ProtectedRoute;