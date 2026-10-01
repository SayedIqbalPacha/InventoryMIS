import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { getReports } from "@/services/Reports";

import ReportCard from "@/component/ReportCard";
import ReportTable from "@/component/ReportTable";
import PageHeader from "@/component/PageHeader";
import PrintButton from "@/component/PrintButton";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ==================================================
// REPORTS PAGE
// ==================================================

export default function Reports() {
  const { t, i18n } = useTranslation();
  const isDari = (i18n.resolvedLanguage || i18n.language).startsWith("prs");
  const printStockReport = useRef(null);
  const printSalesReport = useRef(null);
  const printPurchaseReport = useRef(null);
  const printCostReport = useRef(null);
  const printLossReport = useRef(null);
  // --------------------------------------------------
  // DATA
  // --------------------------------------------------

  const [summary, setSummary] = useState(null);

  const [stock, setStock] = useState([]);

  const [sales, setSales] = useState([]);

  const [purchases, setPurchases] = useState([]);

  const [costs, setCosts] = useState([]);

  const [loss, setLoss] = useState([]);

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  const [loading, setLoading] = useState(true);

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  const [error, setError] = useState("");

  // --------------------------------------------------
  // LOAD REPORTS
  // --------------------------------------------------

  async function loadReports() {
    try {
      setLoading(true);
      setError("");

      const response = await getReports();

      setSummary(response?.data?.summary || null);

      setStock(response?.data?.stock || []);

      setSales(response?.data?.sales || []);

      setPurchases(response?.data?.purchases || []);

      setCosts(response?.data?.costs || []);

      setLoss(response?.data?.loss || []);
    } catch {
      setError("failedToLoadReports");
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------------------------
  // INITIAL FETCH
  // --------------------------------------------------

  useEffect(() => {
    loadReports();
  }, []);

  // ==================================================
  // CHART DATA
  // ==================================================

  // --------------------------------------------------
  // SALES BY ITEM
  // --------------------------------------------------

  const salesChart = useMemo(() => {
    const map = {};

    sales.forEach((sale) => {
      const itemId = Number(sale.item_id);

      //this means that if the itemId is not already present in the map,
      //  we create a new entry for it with the name of the item and an initial revenue of 0.
      //  This ensures that each item is only added once to the map,
      // and we can then accumulate the revenue for that item as we iterate through the sales data.
      if (!map[itemId]) {
        map[itemId] = {
          name: sale.item_name,
          revenue: 0,
        };
      }

      map[itemId].revenue += Number(sale.sale_of_item || 0);
    });

    return Object.values(map);
  }, [sales]);

  // --------------------------------------------------
  // PURCHASES BY ITEM
  // --------------------------------------------------

  const purchaseChart = useMemo(() => {
    const map = {};

    purchases.forEach((purchase) => {
      const itemId = Number(purchase.item_id);

      if (!map[itemId]) {
        map[itemId] = {
          name: purchase.item_name,
          quantity: 0,
        };
      }

      map[itemId].quantity += Number(purchase.total_qty || 0);
    });

    return Object.values(map);
  }, [purchases]);

  // --------------------------------------------------
  // STOCK BY ITEM
  // --------------------------------------------------

  const stockChart = useMemo(() => {
    return stock.map((item) => ({
      name: item.item_name,
      stock: Number(item.current_stock || 0),
    }));
  }, [stock]);

  // --------------------------------------------------
  // FINANCIAL SUMMARY
  // --------------------------------------------------

  const financialChart = useMemo(() => {
    if (!summary) {
      return [];
    }

    return [
      {
        name: t("financialSummary"),
        Revenue: Number(summary.total_revenue_afn || 0),
        Cost: Number(summary.total_cost_afn || 0),
        Profit: Number(summary.total_profit_afn || 0),
      },
    ];
  }, [summary, t]);

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center text-sm text-muted-foreground">
        {t("loadingReports")}
      </div>
    );
  }

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="min-w-0 space-y-5 sm:space-y-6">
      {/* ==================================================
          HEADER
      ================================================== */}

      <PageHeader
        title={t("reports")}
        description={t("reportsDescription")}
      />

      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {t(error)}
        </div>
      )}

      {/* ==================================================
          SUMMARY CARDS
      ================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ReportCard
          title={t("revenue")}
          value={summary?.total_revenue_afn}
          suffix={t("currencyAFN")}
          formatDariNumbers={isDari}
        />

        <ReportCard
          title={t("cost")}
          value={summary?.total_cost_afn}
          suffix={t("currencyAFN")}
          formatDariNumbers={isDari}
        />

        <ReportCard
          title={t("profit")}
          value={summary?.total_profit_afn}
          suffix={t("currencyAFN")}
          formatDariNumbers={isDari}
        />

        <ReportCard
          title={t("loss")}
          value={summary?.total_loss_afn}
          suffix={t("currencyAFN")}
          formatDariNumbers={isDari}
        />

        <ReportCard
          title={t("totalItems")}
          value={summary?.total_items}
          formatDariNumbers={isDari}
        />

        <ReportCard
          title={t("purchasedQuantity")}
          value={summary?.total_purchased}
          formatDariNumbers={isDari}
        />

        <ReportCard
          title={t("soldQuantity")}
          value={summary?.total_sold}
          formatDariNumbers={isDari}
        />

        <ReportCard
          title={t("currentStock")}
          value={summary?.current_stock}
          formatDariNumbers={isDari}
        />
      </div>

      {/* ==================================================
          CHARTS
      ================================================== */}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* SALES */}

        <ReportChartCard title={t("salesByItem")}>
          <ResponsiveContainer
            width="100%"
            height="100%"
            minWidth={0}
            minHeight={280}
          >
            <BarChart
              data={salesChart}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 45,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis
                dataKey="name"
                tick={{ fontSize: 9 }}
                angle={-35}
                textAnchor="end"
                interval={0}
                height={60}
                tickFormatter={formatChartName}
              />

              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => formatReportNumber(value, isDari)}
                width={48}
              />

              <Tooltip
                formatter={(value) => [
                  formatReportNumber(value, isDari),
                  t("revenue"),
                ]}
              />

              <Bar
                dataKey="revenue"
                name={t("revenue")}
                fill="#2563eb"
                radius={[5, 5, 0, 0]}
                maxBarSize={45}
              />
            </BarChart>
          </ResponsiveContainer>
        </ReportChartCard>

        {/* PURCHASES */}

        <ReportChartCard title={t("purchasesByItem")}>
          <ResponsiveContainer
            width="100%"
            height="100%"
            minHeight={280}
            minWidth={0}
          >
            <BarChart
              data={purchaseChart}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 45,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis
                dataKey="name"
                tick={{ fontSize: 11 }}
                angle={-35}
                textAnchor="end"
                interval={0}
                height={60}
                tickFormatter={formatChartName}
              />

              <YAxis
                tick={{ fontSize: 9 }}
                tickFormatter={(value) => formatReportNumber(value, isDari)}
                width={48}
              />

              <Tooltip
                formatter={(value) => [
                  formatReportNumber(value, isDari),
                  t("quantity"),
                ]}
              />

              <Bar
                dataKey="quantity"
                name={t("quantity")}
                fill="#7c3aed"
                radius={[5, 5, 0, 0]}
                maxBarSize={45}
              />
            </BarChart>
          </ResponsiveContainer>
        </ReportChartCard>

        {/* STOCK */}

        <ReportChartCard title={t("currentStockByItem")}>
          <ResponsiveContainer
            width="100%"
            height="100%"
            minHeight={280}
            minWidth={0}
          >
            <BarChart
              data={stockChart}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 45,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis
                dataKey="name"
                tick={{ fontSize: 9 }}
                angle={-35}
                textAnchor="end"
                interval={0}
                height={60}
                tickFormatter={formatChartName}
              />

              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => formatReportNumber(value, isDari)}
                width={50}
              />

              <Tooltip
                formatter={(value) => [
                  formatReportNumber(value, isDari),
                  t("currentStock"),
                ]}
              />

              <Bar
                dataKey="stock"
                name={t("currentStock")}
                fill="#16a34a"
                radius={[5, 5, 0, 0]}
                maxBarSize={45}
              />
            </BarChart>
          </ResponsiveContainer>
        </ReportChartCard>

        {/* FINANCIAL */}

        <ReportChartCard title={t("revenueVsCostVsProfit")}>
          <ResponsiveContainer
            width="100%"
            height="100%"
            minHeight={280}
            minWidth={0}
          >
            <BarChart
              data={financialChart}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis
                dataKey="name"
                tick={false}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => formatReportNumber(value, isDari)}
                width={60}
              />

              <Tooltip
                formatter={(value, name) => [
                  `${formatReportNumber(value, isDari)} ${t("currencyAFN")}`,
                  name,
                ]}
              />

              <Legend />

              <Bar
                dataKey="Revenue"
                name={t("revenue")}
                fill="#2563eb"
                radius={[5, 5, 0, 0]}
                maxBarSize={45}
              />

              <Bar
                dataKey="Cost"
                name={t("cost")}
                fill="#f59e0b"
                radius={[5, 5, 0, 0]}
                maxBarSize={45}
              />

              <Bar
                dataKey="Profit"
                name={t("profit")}
                fill="#16a34a"
                radius={[5, 5, 0, 0]}
                maxBarSize={45}
              />
            </BarChart>
          </ResponsiveContainer>
        </ReportChartCard>
      </div>

      {/* ==================================================
          STOCK TABLE
      ================================================== */}

      <div>
        <PrintButton
          contentRef={printStockReport}
          title={t("printSaveReport")}
          documentTitle={t("availableStockReport")}
        />
        <div ref={printStockReport}>
          <ReportTable
            title={t("stockReport")}
            emptyMessage={t("noReportData")}
            formatNumbers={isDari}
            columns={[
              {
                key: "item_name",
                label: t("item"),
              },
              {
                key: "total_purchased",
                label: t("purchasedQuantity"),
              },
              {
                key: "total_sold",
                label: t("soldQuantity"),
              },
              {
                key: "current_stock",
                label: t("currentStock"),
              },
            ]}
            data={stock}
          />
        </div>
      </div>
      {/* ==================================================
          SALES TABLE
      ================================================== */}

      <div>
        <PrintButton
          contentRef={printSalesReport}
          title={t("printSaveReport")}
          documentTitle={t("allSalesReport")}
        />
        <div ref={printSalesReport}>
          <ReportTable
            title={t("salesReport")}
            emptyMessage={t("noReportData")}
            formatNumbers={isDari}
            columns={[
              {
                key: "sales_id",
                label: t("saleId"),
              },
              {
                key: "item_name",
                label: t("item"),
              },
              {
                key: "sale_of_item",
                label: t("revenueAFN"),
                render: (row) =>
                  formatReportNumber(row.sale_of_item || 0, isDari, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }),
              },
            ]}
            data={sales.map((sale, index) => ({
              ...sale,
              id: `${sale.sales_id}-${sale.item_id}-${index}`,
            }))}
          />
        </div>
      </div>

      {/* ==================================================
          PURCHASE TABLE
      ================================================== */}

      <div>
        <PrintButton
          contentRef={printPurchaseReport}
          title={t("printSaveReport")}
          documentTitle={t("allPurchasesReport")}
        />
        <div ref={printPurchaseReport}>
          <ReportTable
            title={t("purchaseReport")}
            emptyMessage={t("noReportData")}
            formatNumbers={isDari}
            columns={[
              {
                key: "purchase_id",
                label: t("purchaseId"),
              },
              {
                key: "item_name",
                label: t("item"),
              },
              {
                key: "total_qty",
                label: t("quantity"),
              },
              {
                key: "cost_to_afn",
                label: t("costPerUnitAFN"),
                render: (row) =>
                  formatReportNumber(row.cost_to_afn || 0, isDari, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }),
              },
            ]}
            data={purchases.map((purchase, index) => ({
              ...purchase,
              id: `${purchase.purchase_id}-${purchase.item_id}-${index}`,
            }))}
          />
        </div>
      </div>
      {/* ==================================================
          COST TABLE
      ================================================== */}

      <div>
        <PrintButton
          contentRef={printPurchaseReport}
          title={t("printSaveReport")}
          documentTitle={t("allCostsReport")}
        />
        <div ref={printCostReport}>
          <ReportTable
            title={t("costReport")}
            emptyMessage={t("noReportData")}
            formatNumbers={isDari}
            columns={[
              {
                key: "purchase_id",
                label: t("purchaseId"),
              },
              {
                key: "item_name",
                label: t("item"),
              },
              {
                key: "cost_of_item_afn",
                label: t("totalCostAFN"),
                render: (row) =>
                  formatReportNumber(row.cost_of_item_afn || 0, isDari, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }),
              },
            ]}
            data={costs.map((cost, index) => ({
              ...cost,
              id: `${cost.purchase_id}-${cost.item_id}-${index}`,
            }))}
          />
        </div>
      </div>
      {/* ==================================================
          LOSS TABLE
      ================================================== */}

      <div>
        <PrintButton
          contentRef={printLossReport}
          title={t("printSaveReport")}
          documentTitle={t("allLossReport")}
        />
        <div ref={printLossReport}>
          <ReportTable
            title={t("lossReport")}
            emptyMessage={t("noReportData")}
            formatNumbers={isDari}
            columns={[
              {
                key: "allocation_id",
                label: t("allocationId"),
              },
              {
                key: "allocated_qty",
                label: t("quantity"),
              },
              {
                key: "total_cost_afn",
                label: t("costAFN"),
                render: (row) =>
                  formatReportNumber(row.total_cost_afn || 0, isDari, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }),
              },
              {
                key: "total_revenue_afn",
                label: t("revenueAFN"),
                render: (row) =>
                  formatReportNumber(row.total_revenue_afn || 0, isDari, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }),
              },
              {
                key: "total_loss_afn",
                label: t("lossAFN"),
                render: (row) =>
                  formatReportNumber(row.total_loss_afn || 0, isDari, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }),
              },
            ]}
            data={loss}
          />
        </div>
      </div>
    </div>
  );
}

function formatReportNumber(value, isDari, options = {}) {
  return new Intl.NumberFormat(isDari ? "fa-AF" : undefined, options).format(
    Number(value) || 0,
  );
}

// ==================================================
// CHART CARD
// ==================================================

function ReportChartCard({ title, children }) {
  return (
    <section className="min-w-0 overflow-hidden rounded-xl border bg-card p-4 shadow-sm sm:p-5">
      <div className="mb-4">
        <h2 className="truncate text-base font-semibold sm:text-lg">{title}</h2>
      </div>

      <div className="h-[280px] min-w-0 w-full sm:h-[320px]">{children}</div>
    </section>
  );
}

// ==================================================
// CHART NAME FORMATTER
// ==================================================

function formatChartName(name) {
  if (!name) {
    return "";
  }

  return name.length > 12 ? `${name.slice(0, 12)}...` : name;
}
