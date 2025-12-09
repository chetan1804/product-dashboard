import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * Protected Component — Enforces authentication and role-based access control
 *
 * Usage:
 * <Protected>
 *   <Dashboard />
 * </Protected>
 *
 * OR with specific role requirement:
 * <Protected roles={["super_admin"]}>
 *   <StoreManagement />
 * </Protected>
 *
 * OR with multiple allowed roles:
 * <Protected roles={["super_admin", "admin"]}>
 *   <AllOrders />
 * </Protected>
 */
export default function Protected({ children, roles = null, fallback = null }) {
  const { user } = useAuth();

  // Check authentication
  if (!user) {
    console.log("[Protected] Not authenticated - redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (roles && !roles.includes(user.role)) {
    console.log(
      `[Protected] User role '${user.role}' not in allowed roles:`,
      roles,
      "- redirecting to dashboard"
    );

    // Return fallback if provided (e.g., "Access Denied" component)
    if (fallback) {
      return fallback;
    }

    return <Navigate to="/" replace />;
  }

  // All checks passed
  return children;
}
