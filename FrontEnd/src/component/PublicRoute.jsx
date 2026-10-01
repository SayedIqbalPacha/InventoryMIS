import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";

export default function PublicRoute() {
  const { t } = useTranslation();
  const {isAuthenticated,loading,} = useAuth();


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>{t("loading")}</p>
      </div>
    );
  }


  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }


  return <Outlet />;
}
