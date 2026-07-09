import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute() {
  const { isChecking, isAuthenticated } = useAuth();

  if (isChecking) {
    return (
      <div className="cn-auth-check-screen">
        <div className="cn-auth-check-orb" />
        <p>Checking your session...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}
