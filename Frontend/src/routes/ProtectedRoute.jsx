import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../utils/constants";

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  if (!user) return <Navigate to={ROUTES.SIGN_IN} replace />;
  if (role && user.role !== role) return <Navigate to={ROUTES.DASHBOARD} replace />;

  return children;
}
