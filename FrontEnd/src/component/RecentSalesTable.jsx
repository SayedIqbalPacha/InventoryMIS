import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useTranslation } from "react-i18next";

function formatNumber(value, locale) {
  return new Intl.NumberFormat(locale).format(value || 0);
}

function formatDate(date, locale) {
  if (!date) return "";

  return new Intl.DateTimeFormat(locale, {
    calendar: "gregory",
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

function getSaleKey(sale) {
  return `${sale.sales_id}-${sale.item_id}`;
}

export function SalesTable({ data = [] }) {
  const { t, i18n } = useTranslation();
  const isDari = (i18n.resolvedLanguage || i18n.language).startsWith("prs");
  const locale = isDari ? "fa-AF" : "en-US";
  const total = data.reduce(
    (sum, sale) => sum + Number(sale.total_sale_afn || 0),
    0,
  );

  return (
    <Table>
      <TableCaption>{t("recentSales")}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>{t("sale")}</TableHead>
          <TableHead>{t("customer")}</TableHead>
          <TableHead>{t("item")}</TableHead>
          <TableHead>{t("date")}</TableHead>
          <TableHead className="text-end">{t("amount")}</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center">
              {t("noSalesFound")}
            </TableCell>
          </TableRow>
        ) : (
          data.map((sale) => (
            <TableRow key={getSaleKey(sale)}>
              <TableCell className="font-medium">#{sale.sales_id}</TableCell>

              <TableCell>{sale.customer_name}</TableCell>

              <TableCell>{sale.item_name}</TableCell>

              <TableCell>{formatDate(sale.sales_date, locale)}</TableCell>

              <TableCell className="text-right">
                {formatNumber(sale.total_sale_afn, locale)} {t("currencyAFN")}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>

      <TableFooter>
        <TableRow>
          <TableCell colSpan={4}>{t("totalShown")}</TableCell>

          <TableCell className="text-right">
            {formatNumber(total, locale)} {t("currencyAFN")}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
