import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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

function formatDate(date) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

function formatValue(value) {
  return new Intl.NumberFormat("en-US").format(value || 0);
}

export function SalesPurchase({ data = [] }) {
  const chartData = data.map((row) => ({
    date: row.transaction_date,
    dateLabel: formatDate(row.transaction_date),
    sales: Number(row.total_sales_afn) || 0,
    purchases: Number(row.total_purchase_afn) || 0,
  }));

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Sales and Purchases</h2>

        <p className="text-sm text-muted-foreground">
          Daily sales and purchase amounts in AFN
        </p>
      </div>

      <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 10,
          }}
        >
          <CartesianGrid vertical={false} />

          <XAxis
            dataKey="dateLabel"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />

          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={formatValue}
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
            radius={4}
          />

          <Bar
            dataKey="purchases"
            name="Purchases"
            fill="var(--color-purchases)"
            radius={4}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
