import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useTranslation } from "react-i18next";
import { formatLocaleDate, formatLocaleNumber } from "@/lib/localeFormatters";
// ==================================================
// FORMAT DATE
// ==================================================

// ==================================================
// SALES & PURCHASES
// ==================================================

export function SalesPurchase({ data = [] }) {
  const { t, i18n } = useTranslation();
  const isDari = (i18n.resolvedLanguage || i18n.language).startsWith("prs");

  const chartConfig = {
    sales: {
      label: t("sales"),
      color: "#2563eb",
    },
    purchases: {
      label: t("purchases"),
      color: "#f97316",
    },
  };
  // --------------------------------------------------
  // CHART DATA
  // --------------------------------------------------

  const chartData = data.map((row) => ({
    date: row.transaction_date,

    dateLabel: formatLocaleDate(row.transaction_date, isDari, {
      formatEnglish: true,
      month: "short",
      day: "numeric",
    }),

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
          {t("salesAndPurchases")}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {t("chartDescription")}
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
              tickFormatter={(value) =>
                formatLocaleNumber(value, isDari, { formatEnglish: true })
              }
              tick={{ fontSize: 11 }}
              width={80}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) =>
                    `${formatLocaleNumber(value, isDari, { formatEnglish: true })} ${t("currencyAFN")}`
                  }
                />
              }
            />

            <ChartLegend content={<ChartLegendContent />} />

            <Bar
              dataKey="sales"
              name={t("sales")}
              fill="var(--color-sales)"
              radius={[5, 5, 0, 0]}
              maxBarSize={28}
            />

            <Bar
              dataKey="purchases"
              name={t("purchases")}
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
