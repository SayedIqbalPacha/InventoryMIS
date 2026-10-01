import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";

export default function ProtectedRoute() {
  const { t } = useTranslation();
  const {isAuthenticated,loading,} = useAuth();

  const location = useLocation();


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>{t("checkingAuthentication")}</p>
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
