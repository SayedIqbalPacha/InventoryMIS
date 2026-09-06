import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function ProtectedRoute() {
  const {isAuthenticated,loading,} = useAuth();

  const location = useLocation();


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Checking authentication...</p>
      </div>
    );
  }


  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        // Pass the current location to the login page like it could be customer page so that we can redirect back after successful login
        state={{ from: location }}
      />
    );
  }


  return <Outlet />;
}