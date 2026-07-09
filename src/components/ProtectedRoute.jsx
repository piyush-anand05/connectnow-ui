import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const location = useLocation();
  const { isChecking, isAuthenticated } = useAuth();

  if (isChecking) {
    return (
      <div className="cn-auth-check-screen">
        <div className="cn-auth-check-orb" />
        <p>Opening your locality...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
