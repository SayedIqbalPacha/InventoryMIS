import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/components/ThemProvider";
import PageHeader from "@/component/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function Settings() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <PageHeader
        title={t("settings")}
        description={t("settingsDescription")}
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("appearance")}</CardTitle>
            <CardDescription>{t("appearanceDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => setTheme("light")}
            >
              {t("lightTheme")}
            </Button>
            <Button
              type="button"
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => setTheme("dark")}
            >
              {t("darkTheme")}
            </Button>
            <Button
              type="button"
              variant={theme === "system" ? "default" : "outline"}
              onClick={() => setTheme("system")}
            >
              {t("system")}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("account")}</CardTitle>
            <CardDescription>
              {t("accountDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button type="button" onClick={() => navigate("/profile")}>
              {t("goToProfile")}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("session")}</CardTitle>
            <CardDescription>{t("sessionDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button type="button" variant="outline" onClick={handleLogout}>
              {t("signOut")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Settings;
