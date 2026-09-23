import { useEffect, useRef, useState } from "react";
import { getVendorActivity } from "@/services/Reports";
import { getVendors } from "@/services/Vendor";
import PageHeader from "@/component/PageHeader";
import ReportCard from "@/component/ReportCard";
import ReportTable from "@/component/ReportTable";
import PrintButton from "@/component/PrintButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const money = (value) =>
  Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const date = (value) => (value ? String(value).slice(0, 10) : "-");

export default function VendorActivity() {
  const printRef = useRef(null);
  const [vendors, setVendors] = useState([]);
  const [vendorId, setVendorId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getVendors()
      .then((response) => setVendors(response?.data || []))
      .catch((err) => setError(err.message || "Failed to load vendors."));
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!vendorId || !fromDate || !toDate) {
      setError("Choose a vendor and date range.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await getVendorActivity({ vendorId, fromDate, toDate });
      setResult(response?.data || null);
    } catch (err) {
      setResult(null);
      setError(err.message || "Failed to load vendor activity.");
    } finally {
      setLoading(false);
    }
  }

  const purchases = result?.purchases?.rows || [];
  const payments = result?.payments?.rows || [];
  const account = result?.account;

  return (
    <div className="min-w-0 space-y-5 sm:space-y-6">
      <PageHeader
        title="Vendor Activity"
        description="Review purchases during a selected period, complete payment history, and the outstanding balance for a vendor."
      />
      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-xl border bg-card p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4"
      >
        <div className="space-y-2">
          <Label htmlFor="vendor-from-date">From date</Label>
          <Input
            id="vendor-from-date"
            type="date"
            value={fromDate}
            onChange={(event) => setFromDate(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vendor-to-date">To date</Label>
          <Input
            id="vendor-to-date"
            type="date"
            value={toDate}
            onChange={(event) => setToDate(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vendor-activity-vendor">Vendor</Label>
          <select
            id="vendor-activity-vendor"
            value={vendorId}
            onChange={(event) => setVendorId(event.target.value)}
            className="h-9 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="">Select a vendor</option>
            {vendors.map((vendor) => (
              <option key={vendor.vendor_id} value={vendor.vendor_id}>
                {vendor.vendor_name}
              </option>
            ))}
          </select>
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
      {result && (
        <>
          <section className="rounded-xl border bg-card p-4 shadow-sm">
            <h2 className="text-lg font-semibold">
              {result.vendor.vendor_name}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {result.period.fromDate} to {result.period.toDate}
            </p>
            <p className="mt-2 text-sm">
              {result.vendor.email || result.vendor.address || ""}
            </p>
          </section>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <ReportCard
              title="Purchases in period"
              value={result.purchases.total_afn}
              suffix="AFN"
            />
            <ReportCard
              title="All payments"
              value={result.payments.total_afn}
              suffix="AFN"
            />
            <ReportCard
              title="Total purchases"
              value={account.total_purchases_afn}
              suffix="AFN"
            />
            <ReportCard
              title={
                account.status === "vendor_credit"
                  ? "Vendor credit"
                  : account.status === "settled"
                    ? "Account settled"
                    : "Owed to vendor"
              }
              value={Math.abs(account.outstanding_afn)}
              suffix="AFN"
            />
          </div>
          <div ref={printRef} className="space-y-5">
            <ReportTable
              title="Purchases in period"
              emptyMessage="No purchases found in this date range."
              columns={[
                { key: "purchase_id", label: "Purchase #" },
                {
                  key: "purchase_date",
                  label: "Date",
                  render: (row) => date(row.purchase_date),
                },
                { key: "currency_code", label: "Currency" },
                {
                  key: "total_original",
                  label: "Purchase total",
                  render: (row) => money(row.total_original),
                },
                {
                  key: "total_afn",
                  label: "Total AFN",
                  render: (row) => money(row.total_afn),
                },
              ]}
              data={purchases}
            />
            <ReportTable
              title="All payments"
              emptyMessage="No payments have been recorded for this vendor."
              columns={[
                { key: "payment_id", label: "Payment #" },
                {
                  key: "payment_date",
                  label: "Date",
                  render: (row) => date(row.payment_date),
                },
                {
                  key: "purchase_id",
                  label: "Purchase #",
                  render: (row) => row.purchase_id ?? "Unallocated",
                },
                { key: "currency_code", label: "Currency" },
                {
                  key: "amount_original",
                  label: "Payment",
                  render: (row) => money(row.amount_original),
                },
                {
                  key: "amount_afn",
                  label: "Amount AFN",
                  render: (row) => money(row.amount_afn),
                },
                {
                  key: "vendor_mismatch",
                  label: "Vendor link",
                  render: (row) => (row.vendor_mismatch ? "Mismatch" : "OK"),
                },
              ]}
              data={payments}
            />
          </div>
          {account.status === "vendor_credit" && (
            <p className="text-sm text-muted-foreground">
              Payments exceed recorded purchases by{" "}
              {money(Math.abs(account.outstanding_afn))} AFN.
            </p>
          )}
          <PrintButton
            contentRef={printRef}
            title="Print / save activity"
            documentTitle={`Vendor-Activity-${result.vendor.vendor_name}`}
          />
        </>
      )}
    </div>
  );
}
