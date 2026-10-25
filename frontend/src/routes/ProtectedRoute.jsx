import { Navigate } from "react-router-dom";
import { useAuth, dashboardPath } from "../utils/AuthContext";

// UI-level guard only — the API enforces the real permissions.
export default function ProtectedRoute({ allowedRoles, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to={dashboardPath(user.role)} replace />;
  return children;
}
