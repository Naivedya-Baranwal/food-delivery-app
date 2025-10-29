// components/ProtectedRoutes/ProtectedRoutes.jsx
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import './ProtectedRoutes.css'; // ✅ Import CSS

const ProtectedRoute = ({ token, setShowLogin, children, isTokenReady }) => {
  const location = useLocation();

  useEffect(() => {
    if (isTokenReady && !token) {
      // Show login popup when user not authenticated
      setShowLogin(true);
    }
  }, [token, setShowLogin, isTokenReady]);

  if (!isTokenReady) {
    return (
      <div className="verify">
        <div className="spinner"></div>
        <p className="loading-text">Verifying authentication...</p>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
