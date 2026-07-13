import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { ROUTES } from "../utils/constants.js";

const LoadingSpinner = () => (
  <div className="min-h-screen bg-dark-900 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

export const ProtectedRoute = ({ children, allowedRoles, role }) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) return <LoadingSpinner />;

  if (!isAuthenticated && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const targetRoles = allowedRoles || (role ? [role] : null);
  
  if (targetRoles && !targetRoles.includes(user.role)) {
    return (
      <Navigate
        to={user.role === "admin" ? "/admin" : "/dashboard"}
        replace
      />
    );
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
