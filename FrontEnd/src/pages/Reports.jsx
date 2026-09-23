import { useEffect, useMemo, useRef, useState } from "react";

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
    } catch (err) {
      setError(err?.message || "Failed to load reports.");
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
        name: "Financial",
        Revenue: Number(summary.total_revenue_afn || 0),
        Cost: Number(summary.total_cost_afn || 0),
        Profit: Number(summary.total_profit_afn || 0),
      },
    ];
  }, [summary]);

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center text-sm text-muted-foreground">
        Loading reports...
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
        title="Reports"
        description="View inventory, sales, purchase, and financial reports"
      />

      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* ==================================================
          SUMMARY CARDS
      ================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ReportCard
          title="Revenue"
          value={summary?.total_revenue_afn}
          suffix="AFN"
        />

        <ReportCard title="Cost" value={summary?.total_cost_afn} suffix="AFN" />

        <ReportCard
          title="Profit"
          value={summary?.total_profit_afn}
          suffix="AFN"
        />

        <ReportCard title="Loss" value={summary?.total_loss_afn} suffix="AFN" />

        <ReportCard
          title="Total Items"
          value={summary?.total_items}
          decimals={0}
        />

        <ReportCard
          title="Purchased Quantity"
          value={summary?.total_purchased}
        />

        <ReportCard title="Sold Quantity" value={summary?.total_sold} />

        <ReportCard title="Current Stock" value={summary?.current_stock} />
      </div>

      {/* ==================================================
          CHARTS
      ================================================== */}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* SALES */}

        <ReportChartCard title="Sales by Item">
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

              <YAxis tick={{ fontSize: 11 }} width={48} />

              <Tooltip
                formatter={(value) => [
                  Number(value).toLocaleString(),
                  "Revenue",
                ]}
              />

              <Bar
                dataKey="revenue"
                name="Revenue"
                fill="#2563eb"
                radius={[5, 5, 0, 0]}
                maxBarSize={45}
              />
            </BarChart>
          </ResponsiveContainer>
        </ReportChartCard>

        {/* PURCHASES */}

        <ReportChartCard title="Purchases by Item">
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

              <YAxis tick={{ fontSize: 9 }} width={48} />

              <Tooltip
                formatter={(value) => [
                  Number(value).toLocaleString(),
                  "Quantity",
                ]}
              />

              <Bar
                dataKey="quantity"
                name="Quantity"
                fill="#7c3aed"
                radius={[5, 5, 0, 0]}
                maxBarSize={45}
              />
            </BarChart>
          </ResponsiveContainer>
        </ReportChartCard>

        {/* STOCK */}

        <ReportChartCard title="Current Stock by Item">
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

              <YAxis tick={{ fontSize: 11 }} width={50} />

              <Tooltip
                formatter={(value) => [Number(value).toLocaleString(), "Stock"]}
              />

              <Bar
                dataKey="stock"
                name="Current Stock"
                fill="#16a34a"
                radius={[5, 5, 0, 0]}
                maxBarSize={45}
              />
            </BarChart>
          </ResponsiveContainer>
        </ReportChartCard>

        {/* FINANCIAL */}

        <ReportChartCard title="Revenue vs Cost vs Profit">
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

              <YAxis tick={{ fontSize: 11 }} width={60} />

              <Tooltip
                formatter={(value, name) => [
                  `${Number(value).toLocaleString()} AFN`,
                  name,
                ]}
              />

              <Legend />

              <Bar
                dataKey="Revenue"
                fill="#2563eb"
                radius={[5, 5, 0, 0]}
                maxBarSize={45}
              />

              <Bar
                dataKey="Cost"
                fill="#f59e0b"
                radius={[5, 5, 0, 0]}
                maxBarSize={45}
              />

              <Bar
                dataKey="Profit"
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
          title="print/save report"
          documentTitle="Available Stock"
        />
        <div ref={printStockReport}>
          <ReportTable
            title="Stock Report"
            columns={[
              {
                key: "item_name",
                label: "Item",
              },
              {
                key: "total_purchased",
                label: "Purchased",
              },
              {
                key: "total_sold",
                label: "Sold",
              },
              {
                key: "current_stock",
                label: "Current Stock",
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
          title="print/save report"
          documentTitle="All Sales"
        />
        <div ref={printSalesReport}>
          <ReportTable
            title="Sales Report"
            columns={[
              {
                key: "sales_id",
                label: "Sale ID",
              },
              {
                key: "item_name",
                label: "Item",
              },
              {
                key: "sale_of_item",
                label: "Revenue AFN",
                render: (row) =>
                  Number(row.sale_of_item || 0).toLocaleString(undefined, {
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
          title="print/save report"
          documentTitle="All Purchases"
        />
        <div ref={printPurchaseReport}>
          <ReportTable
            title="Purchase Report"
            columns={[
              {
                key: "purchase_id",
                label: "Purchase ID",
              },
              {
                key: "item_name",
                label: "Item",
              },
              {
                key: "total_qty",
                label: "Quantity",
              },
              {
                key: "cost_to_afn",
                label: "Cost / Unit AFN",
                render: (row) =>
                  Number(row.cost_to_afn || 0).toLocaleString(undefined, {
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
          title="print/save report"
          documentTitle="All Costs"
        />
        <div ref={printCostReport}>
          <ReportTable
            title="Cost Report"
            columns={[
              {
                key: "purchase_id",
                label: "Purchase ID",
              },
              {
                key: "item_name",
                label: "Item",
              },
              {
                key: "cost_of_item_afn",
                label: "Total Cost AFN",
                render: (row) =>
                  Number(row.cost_of_item_afn || 0).toLocaleString(undefined, {
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
          title="print/save report"
          documentTitle="All Loss"
        />
        <div ref={printLossReport}>
          <ReportTable
            title="Loss Report"
            columns={[
              {
                key: "allocation_id",
                label: "Allocation ID",
              },
              {
                key: "allocated_qty",
                label: "Quantity",
              },
              {
                key: "total_cost_afn",
                label: "Cost AFN",
                render: (row) =>
                  Number(row.total_cost_afn || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }),
              },
              {
                key: "total_revenue_afn",
                label: "Revenue AFN",
                render: (row) =>
                  Number(row.total_revenue_afn || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }),
              },
              {
                key: "total_loss_afn",
                label: "Loss AFN",
                render: (row) =>
                  Number(row.total_loss_afn || 0).toLocaleString(undefined, {
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
