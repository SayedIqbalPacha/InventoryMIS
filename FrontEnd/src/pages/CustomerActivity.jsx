import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { getCustomerActivity } from "@/services/Reports";
import { getCustomers } from "@/services/Customer";

import PageHeader from "@/component/PageHeader";
import ReportCard from "@/component/ReportCard";
import ReportTable from "@/component/ReportTable";
import PrintButton from "@/component/PrintButton";
import { localizeInventoryValue } from "@/lib/localizeInventoryValue";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function formatDate(value, isDari) {
  if (!value) {
    return "-";
  }

  const date = String(value).slice(0, 10);
  return isDari ? date.replace(/[0-9]/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[digit]) : date;
}

function formatMoney(value, isDari) {
  return Number(value || 0).toLocaleString(isDari ? "fa-AF" : undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function CustomerActivity() {
  const { t, i18n } = useTranslation();
  const isDari = (i18n.resolvedLanguage || i18n.language).startsWith("prs");
  const printRef = useRef(null);
  const printInvoiceItemsRef = useRef(null);
  const printInoivePaymentRef = useRef(null);

  const [name, setName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [matches, setMatches] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCustomers() {
      try {
        const response = await getCustomers();

        if (!cancelled) {
          setCustomers(response?.data || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "failedToLoadCustomers");
        }
      }
    }

    loadCustomers();

    return () => {
      cancelled = true;
    };
  }, []);

  const suggestions = useMemo(() => {
    const query = name.trim().toLowerCase();

    if (!query) {
      return [];
    }

    return customers.filter((customer) =>
      customer.customer_name.toLowerCase().includes(query),
    );
  }, [customers, name]);

  async function searchCustomer(customerId) {
    if (!fromDate || !toDate) {
      setError("activityDateRangeRequired");
      return;
    }

    if (!customerId && !name.trim()) {
      setError("customerNameRequired");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMatches([]);

      const response = await getCustomerActivity({
        name: name.trim(),
        fromDate,
        toDate,
        customerId,
      });

      if (response.needsSelection) {
        setResult(null);
        setMatches(response.data?.matches || []);
        return;
      }

      setResult(response.data || null);
    } catch (err) {
      setResult(null);
      setMatches([]);
      setError(err.message || "failedToLoadCustomerActivity");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    searchCustomer();
  }

  const invoices = result?.invoices || [];
  const invoiceItems = result?.invoiceItems || [];
  const soldItems = result?.sold?.items || [];
  const payments = result?.payments?.rows || [];

  const customerTitle = useMemo(() => {
    if (!result?.customer) {
      return t("customerActivity");
    }

    return `${result.customer.customer_name}`;
  }, [result, t]);

  return (
    <div className="min-w-0 space-y-5 sm:space-y-6">
      <PageHeader
        title={t("customerActivity")}
        description={t("customerActivityDescription")}
      />

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-xl border bg-card p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4"
      >
        <div className="space-y-2">
          <Label htmlFor="from-date">{t("fromDate")}</Label>
          <Input
            id="from-date"
            type="date"
            value={fromDate}
            onChange={(event) => setFromDate(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="to-date">{t("toDate")}</Label>
          <Input
            id="to-date"
            type="date"
            value={toDate}
            onChange={(event) => setToDate(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customer-name">{t("customerName")}</Label>
          <Input
            id="customer-name"
            type="text"
            placeholder={t("searchByName")}
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setResult(null);
              setMatches([]);
            }}
          />
        </div>

        <div className="flex items-end">
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? t("searching") : t("search")}
          </Button>
        </div>
      </form>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {t(error, { defaultValue: error })}
        </div>
      )}

      {(matches.length > 0 || suggestions.length > 0) && (
        <section className="rounded-xl border bg-card p-4 shadow-sm">
          <h2 className="mb-3 text-base font-semibold">{t("chooseCustomer")}</h2>
          <div className="space-y-2">
            {(matches.length > 0 ? matches : suggestions).map((customer) => (
              <Button
                key={customer.customer_id}
                type="button"
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setName(customer.customer_name);
                  searchCustomer(customer.customer_id);
                }}
              >
                {customer.customer_name}
                {customer.phone ? ` — ${customer.phone}` : ""}
              </Button>
            ))}
          </div>
        </section>
      )}

      {result && (
        <>
          <section className="rounded-xl border bg-card p-4 shadow-sm">
            <h2 className="text-lg font-semibold">{customerTitle}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("reportingPeriod", {
                from: formatDate(result.period.fromDate, isDari),
                to: formatDate(result.period.toDate, isDari),
              })}
            </p>
            <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <p>{t("phone")}: {result.customer.phone || "-"}</p>
              <p>{t("email")}: {result.customer.email || "-"}</p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">{t("sold")}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ReportCard
                title={t("totalSold")}
                value={result.sold.total_sold_afn}
                suffix={isDari ? t("currencyAFN") : "AFN"}
                formatDariNumbers={isDari}
              />
              <ReportCard
                title={t("quantitySold")}
                value={result.sold.total_quantity}
                decimals={0}
                formatDariNumbers={isDari}
              />
            </div>
            <ReportTable
              title={t("itemsSold")}
              emptyMessage={t("noSalesInDateRange")}
              formatNumbers
              columns={[
                { key: "item_name", label: t("item"), render: (row) => localizeInventoryValue(row.item_name, isDari) },
                { key: "quantity_sold", label: t("quantity") },
                {
                  key: "sold_afn",
                  label: t("soldAFN"),
                  render: (row) => formatMoney(row.sold_afn, isDari),
                },
              ]}
              data={soldItems}
            />
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">{t("profit")}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <ReportCard
                title={t("revenue")}
                value={result.profit.revenue_afn}
                suffix={isDari ? t("currencyAFN") : "AFN"}
                formatDariNumbers={isDari}
              />
              <ReportCard
                title={t("cost")}
                value={result.profit.cost_afn}
                suffix={isDari ? t("currencyAFN") : "AFN"}
                formatDariNumbers={isDari}
              />
              <ReportCard
                title={t("profit")}
                value={result.profit.profit_afn}
                suffix={isDari ? t("currencyAFN") : "AFN"}
                formatDariNumbers={isDari}
              />
            </div>
          </section>

          <div>
            <PrintButton
              contentRef={printRef}
              title={t("printSaveInvoices")}
              documentTitle={`Bills-Invoices-${customerTitle}`}
            />
            <div ref={printRef}>
              <ReportTable
                title={t("billsInvoices")}
                emptyMessage={t("noInvoicesInDateRange")}
                formatNumbers
                columns={[
                  { key: "sales_id", label: t("invoiceNumber") },
                  {
                    key: "sales_date",
                    label: t("date"),
                    render: (row) => formatDate(row.sales_date, isDari),
                  },
                  { key: "currency_code", label: t("currency") },
                  { key: "total_qty", label: t("quantity") },
                  {
                    key: "total_original",
                    label: t("billTotal"),
                    render: (row) => formatMoney(row.total_original, isDari),
                  },
                  {
                    key: "total_afn",
                    label: t("totalAFN"),
                    render: (row) => formatMoney(row.total_afn, isDari),
                  },
                ]}
                data={invoices}
              />
            </div>
          </div>

          <div>
            <PrintButton
              contentRef={printInvoiceItemsRef}
              title={t("printSaveInvoiceItems")}
              documentTitle={`Itmes-Invoices`}
            />
            <div ref={printInvoiceItemsRef}>
              <ReportTable
                title={t("invoiceItems")}
                emptyMessage={t("noInvoiceItemsInDateRange")}
                formatNumbers
                columns={[
                  { key: "sales_id", label: t("invoiceNumber") },
                  {
                    key: "sales_date",
                    label: t("date"),
                    render: (row) => formatDate(row.sales_date, isDari),
                  },
                  { key: "item_name", label: t("item"), render: (row) => localizeInventoryValue(row.item_name, isDari) },
                  { key: "quantity", label: t("quantity") },
                  {
                    key: "unit_price",
                    label: t("unitPrice"),
                    render: (row) => formatMoney(row.unit_price, isDari),
                  },
                  {
                    key: "total_afn",
                    label: t("totalAFN"),
                    render: (row) => formatMoney(row.total_afn, isDari),
                  },
                ]}
                data={invoiceItems.map((item, index) => ({
                  ...item,
                  id: `${item.sales_id}-${index}`,
                }))}
              />
            </div>
          </div>

          <div>
            <PrintButton
              contentRef={printInoivePaymentRef}
              title={t("printSavePayments")}
              documentTitle={t("payments")}
            />
            <div ref={printInoivePaymentRef}>
              <ReportTable
                title={t("allPayments")}
                emptyMessage={t("noCustomerPayments")}
                formatNumbers
                columns={[
                  { key: "cus_payment_id", label: t("paymentNumber") },
                  { key: "sale_id", label: t("invoiceNumber") },
                  {
                    key: "date",
                    label: t("date"),
                    render: (row) => formatDate(row.date, isDari),
                  },
                  { key: "currency_code", label: t("currency") },
                  {
                    key: "amount",
                    label: t("amount"),
                    render: (row) => formatMoney(row.amount, isDari),
                  },
                  {
                    key: "amount_afn",
                    label: t("amountAFN"),
                    render: (row) => formatMoney(row.amount_afn, isDari),
                  },
                ]}
                data={payments}
              />
            </div>
          </div>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <ReportCard
              title={t("allTimeSales")}
              value={result.account.total_sold_afn}
              suffix={isDari ? t("currencyAFN") : "AFN"}
              formatDariNumbers={isDari}
            />
            <ReportCard
              title={t("allPayments")}
              value={result.account.total_paid_afn}
              suffix={isDari ? t("currencyAFN") : "AFN"}
              formatDariNumbers={isDari}
            />
            <ReportCard
              title={
                result.account.status === "borrower"
                  ? t("customerOwesYou")
                  : t("outstandingBalance")
              }
              value={result.account.outstanding_afn}
              suffix={isDari ? t("currencyAFN") : "AFN"}
              formatDariNumbers={isDari}
            />
          </section>
        </>
      )}
    </div>
  );
}
