import { useMemo, useRef, useState } from "react";

import { getCustomerActivity } from "@/services/Reports";

import PageHeader from "@/component/PageHeader";
import ReportCard from "@/component/ReportCard";
import ReportTable from "@/component/ReportTable";
import PrintButton from "@/component/PrintButton";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function formatDate(value) {
  if (!value) {
    return "-";
  }

  return String(value).slice(0, 10);
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function CustomerActivity() {
  const printRef = useRef(null);
  const printInvoiceItemsRef = useRef(null);
  const printInoivePaymentRef = useRef(null);

  const [name, setName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [matches, setMatches] = useState([]);
  const [result, setResult] = useState(null);

  async function searchCustomer(customerId) {
    if (!fromDate || !toDate) {
      setError("Please choose from date and to date.");
      return;
    }

    if (!customerId && !name.trim()) {
      setError("Please enter a customer name.");
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
      setError(err.message || "Failed to load customer activity.");
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
      return "Customer Activity";
    }

    return `${result.customer.customer_name}`;
  }, [result]);

  return (
    <div className="min-w-0 space-y-5 sm:space-y-6">
      <PageHeader
        title="Customer Activity"
        description="View date-range sales and profit, complete payment history, and outstanding balance."
      />

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-xl border bg-card p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4"
      >
        <div className="space-y-2">
          <Label htmlFor="from-date">From date</Label>
          <Input
            id="from-date"
            type="date"
            value={fromDate}
            onChange={(event) => setFromDate(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="to-date">To date</Label>
          <Input
            id="to-date"
            type="date"
            value={toDate}
            onChange={(event) => setToDate(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customer-name">Customer name</Label>
          <Input
            id="customer-name"
            type="text"
            placeholder="Search by name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div className="flex items-end">
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>
      </form>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {matches.length > 0 && (
        <section className="rounded-xl border bg-card p-4 shadow-sm">
          <h2 className="mb-3 text-base font-semibold">Choose a customer</h2>
          <div className="space-y-2">
            {matches.map((customer) => (
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
              {result.period.fromDate} to {result.period.toDate}
            </p>
            <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <p>Phone: {result.customer.phone || "-"}</p>
              <p>Email: {result.customer.email || "-"}</p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Sold</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ReportCard
                title="Total sold"
                value={result.sold.total_sold_afn}
                suffix="AFN"
              />
              <ReportCard
                title="Quantity sold"
                value={result.sold.total_quantity}
                decimals={0}
              />
            </div>
            <ReportTable
              title="Items sold"
              emptyMessage="No sales found in this date range."
              columns={[
                { key: "item_name", label: "Item" },
                { key: "quantity_sold", label: "Quantity" },
                {
                  key: "sold_afn",
                  label: "Sold AFN",
                  render: (row) => formatMoney(row.sold_afn),
                },
              ]}
              data={soldItems}
            />
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold">Profit</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <ReportCard
                title="Revenue"
                value={result.profit.revenue_afn}
                suffix="AFN"
              />
              <ReportCard
                title="Cost"
                value={result.profit.cost_afn}
                suffix="AFN"
              />
              <ReportCard
                title="Profit"
                value={result.profit.profit_afn}
                suffix="AFN"
              />
            </div>
          </section>

          <div>
            <PrintButton
              contentRef={printRef}
              title="Print / save Invoices"
              documentTitle={`Bills-Invoices-${customerTitle}`}
            />
            <div ref={printRef}>
              <ReportTable
                title="Bills / Invoices"
                emptyMessage="No invoices found in this date range."
                columns={[
                  { key: "sales_id", label: "Invoice #" },
                  {
                    key: "sales_date",
                    label: "Date",
                    render: (row) => formatDate(row.sales_date),
                  },
                  { key: "currency_code", label: "Currency" },
                  { key: "total_qty", label: "Quantity" },
                  {
                    key: "total_original",
                    label: "Bill total",
                    render: (row) => formatMoney(row.total_original),
                  },
                  {
                    key: "total_afn",
                    label: "Total AFN",
                    render: (row) => formatMoney(row.total_afn),
                  },
                ]}
                data={invoices}
              />
            </div>
          </div>

          <div>
            <PrintButton
              contentRef={printInvoiceItemsRef}
              title="Print / save Invoice Items"
              documentTitle={`Itmes-Invoices`}
            />
            <div ref={printInvoiceItemsRef}>
              <ReportTable
                title="Invoice items"
                emptyMessage="No invoice items found in this date range."
                columns={[
                  { key: "sales_id", label: "Invoice #" },
                  {
                    key: "sales_date",
                    label: "Date",
                    render: (row) => formatDate(row.sales_date),
                  },
                  { key: "item_name", label: "Item" },
                  { key: "quantity", label: "Quantity" },
                  {
                    key: "unit_price",
                    label: "Unit price",
                    render: (row) => formatMoney(row.unit_price),
                  },
                  {
                    key: "total_afn",
                    label: "Total AFN",
                    render: (row) => formatMoney(row.total_afn),
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
              title="Print / Save Payments"
              documentTitle={"Payments"}
            />
            <div ref={printInoivePaymentRef}>
              <ReportTable
                title="All Payments"
                emptyMessage="No payments have been recorded for this customer."
                columns={[
                  { key: "cus_payment_id", label: "Payment #" },
                  { key: "sale_id", label: "Invoice #" },
                  {
                    key: "date",
                    label: "Date",
                    render: (row) => formatDate(row.date),
                  },
                  { key: "currency_code", label: "Currency" },
                  {
                    key: "amount",
                    label: "Amount",
                    render: (row) => formatMoney(row.amount),
                  },
                  {
                    key: "amount_afn",
                    label: "Amount AFN",
                    render: (row) => formatMoney(row.amount_afn),
                  },
                ]}
                data={payments}
              />
            </div>
          </div>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <ReportCard
              title="All-time sales"
              value={result.account.total_sold_afn}
              suffix="AFN"
            />
            <ReportCard
              title="All payments"
              value={result.account.total_paid_afn}
              suffix="AFN"
            />
            <ReportCard
              title={
                result.account.status === "borrower"
                  ? "Customer owes you"
                  : "Outstanding balance"
              }
              value={result.account.outstanding_afn}
              suffix="AFN"
            />
          </section>
        </>
      )}
    </div>
  );
}
