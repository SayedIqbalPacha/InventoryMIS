import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function HomeRedirect() {
  const {
    isAuthenticated,
    loading,
  } = useAuth();


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }


  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }


  return <Navigate to="/login" replace />;
}