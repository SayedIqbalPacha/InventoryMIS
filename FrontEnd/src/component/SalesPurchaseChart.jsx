import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

// ==================================================
// CHART CONFIG
// ==================================================

const chartConfig = {
  sales: {
    label: "Sales",
    color: "#2563eb",
  },

  purchases: {
    label: "Purchases",
    color: "#f97316",
  },
};

// ==================================================
// FORMAT DATE
// ==================================================

function formatDate(date) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

// ==================================================
// FORMAT VALUE
// ==================================================

function formatValue(value) {
  return new Intl.NumberFormat("en-US").format(value || 0);
}

// ==================================================
// SALES & PURCHASES
// ==================================================

export function SalesPurchase({ data = [] }) {
  // --------------------------------------------------
  // CHART DATA
  // --------------------------------------------------

  const chartData = data.map((row) => ({
    date: row.transaction_date,

    dateLabel: formatDate(row.transaction_date),

    sales: Number(row.total_sales_afn) || 0,

    purchases: Number(row.total_purchase_afn) || 0,
  }));

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <section className="min-w-0 overflow-hidden rounded-xl border bg-card p-4 shadow-sm sm:p-5">
      {/* HEADER */}

      <div className="mb-4">
        <h2 className="text-base font-semibold sm:text-lg">
          Sales and Purchases
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Daily sales and purchase amounts in AFN
        </p>
      </div>

      {/* CHART */}

      <div className="h-[280px] min-w-0 w-full sm:h-[320px]">
        <ChartContainer config={chartConfig} className="h-full w-full min-w-0">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />

            <XAxis
              dataKey="dateLabel"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 11 }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={formatValue}
              tick={{ fontSize: 11 }}
              width={80}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => `${formatValue(value)} AFN`}
                />
              }
            />

            <ChartLegend content={<ChartLegendContent />} />

            <Bar
              dataKey="sales"
              name="Sales"
              fill="var(--color-sales)"
              radius={[5, 5, 0, 0]}
              maxBarSize={28}
            />

            <Bar
              dataKey="purchases"
              name="Purchases"
              fill="var(--color-purchases)"
              radius={[5, 5, 0, 0]}
              maxBarSize={28}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </section>
  );
}
