import { useEffect, useState } from "react";
import { SalesTable } from "@/component/RecentSalesTable";
import { SalesPurchase } from "@/component/SalesPurchaseChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PackageIcon,
  ShoppingCart,
  TrendingUp,
  UsersRoundIcon,
} from "lucide-react";
import { getDashboard } from "@/services/apiDashboard";
import { useTranslation } from "react-i18next";
import { translateApiError } from "@/lib/translateApiError";
import { formatLocaleNumber } from "@/lib/localeFormatters";

function formatNumber(value, isDari) {
  return formatLocaleNumber(value, isDari, { formatEnglish: true });
}

function formatAfn(value, isDari, currencyLabel) {
  return `${formatNumber(value, isDari)} ${currencyLabel}`;
}

function DashboardCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-lg bg-primary-foreground p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{title}</CardTitle>

          <Icon className="h-5 w-5 text-muted-foreground" />
        </CardHeader>

        <CardContent>
          <p className="text-2xl font-bold">{value}</p>
        </CardContent>
      </Card>
    </div>
  );
}

function Homepage() {
  const { t, i18n } = useTranslation();
  const isDari = (i18n.resolvedLanguage || i18n.language).startsWith("prs");
  const currencyLabel = t("currencyAFN");
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await getDashboard();

        setDashboard(response.data);
      } catch (err) {
        setError(err.message || "dashboardLoadFailed");
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (isLoading) {
    return <div className="p-6">{t("loadingDashboard")}</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-destructive">
        {error === "dashboardLoadFailed" ? t(error) : translateApiError(error, t, i18n, "dashboardLoadFailed")}
      </div>
    );
  }

  if (!dashboard) {
    return <div className="p-6">{t("noDashboardData")}</div>;
  }

  const { summary, recentSales, chartData } = dashboard;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-4">
      <DashboardCard
        title={t("totalCustomers")}
        value={formatNumber(summary.totalCustomers, isDari)}
        icon={UsersRoundIcon}
      />

      <DashboardCard
        title={t("totalItems")}
        value={formatNumber(summary.totalItems, isDari)}
        icon={PackageIcon}
      />

      <DashboardCard
        title={t("totalSales")}
        value={formatAfn(summary.totalSalesAfn, isDari, currencyLabel)}
        icon={ShoppingCart}
      />

      <DashboardCard
        title={t("totalProfit")}
        value={formatAfn(summary.totalProfitAfn, isDari, currencyLabel)}
        icon={TrendingUp}
      />

      <div className="rounded-lg bg-primary-foreground p-4 lg:col-span-2 2xl:col-span-4">
        <SalesPurchase data={chartData} />
      </div>

      <div className="rounded-lg bg-primary-foreground p-4 lg:col-span-2 2xl:col-span-4">
        <SalesTable data={recentSales} />
      </div>
    </div>
  );
}

export default Homepage;
