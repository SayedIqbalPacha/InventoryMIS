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
          <TableHead className="whitespace-nowrap rtl:text-right">
            {t("sale")}
          </TableHead>
          <TableHead className="whitespace-nowrap rtl:text-right">
            {t("customer")}
          </TableHead>
          <TableHead className="whitespace-nowrap rtl:text-right">
            {t("item")}
          </TableHead>
          <TableHead className="whitespace-nowrap rtl:text-right">
            {t("date")}
          </TableHead>
          <TableHead className="whitespace-nowrap text-end rtl:text-right">
            {t("amount")}
          </TableHead>
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
              <TableCell className="font-medium whitespace-nowrap rtl:text-right">
                #{sale.sales_id}
              </TableCell>

              <TableCell className="whitespace-nowrap rtl:text-right">
                {sale.customer_name}
              </TableCell>

              <TableCell className="whitespace-nowrap rtl:text-right">
                {sale.item_name}
              </TableCell>

              <TableCell className="whitespace-nowrap rtl:text-right">
                {formatDate(sale.sales_date, locale)}
              </TableCell>

              <TableCell className="whitespace-nowrap text-right rtl:text-right">
                {formatNumber(sale.total_sale_afn, locale)} {t("currencyAFN")}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>

      <TableFooter>
        <TableRow>
          <TableCell
            colSpan={4}
            className="whitespace-nowrap rtl:text-right"
          >
            {t("totalShown")}
          </TableCell>

          <TableCell className="whitespace-nowrap text-right rtl:text-right">
            {formatNumber(total, locale)} {t("currencyAFN")}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
