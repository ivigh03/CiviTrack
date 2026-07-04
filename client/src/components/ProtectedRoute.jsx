import { useSelector } from "react-redux";
import {
  Navigate,
  useLocation,
} from "react-router-dom";
import { DASHBOARD_PATH } from "../constants/roles";

/**
 * Usage:
 *   <ProtectedRoute role="admin">
 *   <ProtectedRoute>
 */

export default function ProtectedRoute({
  children,
  role,
}) {

  const { user } = useSelector(
    (state) => state.auth
  );

  const location = useLocation();

  // ❌ Not logged in
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // ❌ Wrong role
  if (
    role &&
    user?.role &&
    user.role !== role
  ) {

    return (
      <Navigate
        to={
          DASHBOARD_PATH[user.role] ||
          "/login"
        }
        replace
      />
    );
  }

  // ✅ Access allowed
  return children;
}