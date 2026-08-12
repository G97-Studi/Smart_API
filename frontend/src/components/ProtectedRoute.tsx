import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Route guard: wraps protected <Route> elements. If there's no valid
// token, redirect to /login instead of rendering the page — this is the
// "Protected Routes (Frontend)" requirement from Milestone 5.
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
