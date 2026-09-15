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

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value || 0);
}

function formatAfn(value) {
  return `${formatNumber(value)} AFN`;
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
          <p className="text-3xl font-bold">{value}</p>
        </CardContent>
      </Card>
    </div>
  );
}

function Homepage() {
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await getDashboard();

        setDashboard(response.data);
      } catch (err) {
        setError(err.message || "Failed to load dashboard");
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (isLoading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-destructive">{error}</div>;
  }

  if (!dashboard) {
    return <div className="p-6">No dashboard data found.</div>;
  }

  const { summary, recentSales, chartData } = dashboard;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-4">
      <DashboardCard
        title="Total Customers"
        value={formatNumber(summary.totalCustomers)}
        icon={UsersRoundIcon}
      />

      <DashboardCard
        title="Total Items"
        value={formatNumber(summary.totalItems)}
        icon={PackageIcon}
      />

      <DashboardCard
        title="Total Sales"
        value={formatAfn(summary.totalSalesAfn)}
        icon={ShoppingCart}
      />

      <DashboardCard
        title="Total Profit"
        value={formatAfn(summary.totalProfitAfn)}
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
