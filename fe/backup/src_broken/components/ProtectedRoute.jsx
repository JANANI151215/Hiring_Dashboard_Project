import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Roles: array of allowed roles for this route
 * Example: ["admin", "recruiter"]
 */
export default function ProtectedRoute({ roles }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    // Logged in but role not allowed
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h2 className="text-xl font-semibold text-red-600">
          🚫 You do not have access to this page.
        </h2>
      </div>
    );
  }

  // Role allowed, render the child route
  return <Outlet />;
}
