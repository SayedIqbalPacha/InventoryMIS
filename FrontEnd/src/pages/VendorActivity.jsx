import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getVendorActivity } from "@/services/Reports";
import { getVendors } from "@/services/Vendor";
import PageHeader from "@/component/PageHeader";
import ReportCard from "@/component/ReportCard";
import ReportTable from "@/component/ReportTable";
import PrintButton from "@/component/PrintButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { localizeInventoryValue } from "@/lib/localizeInventoryValue";

const money = (value, isDari) =>
  Number(value || 0).toLocaleString(isDari ? "fa-AF" : undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const number = (value, isDari) =>
  Number(value || 0).toLocaleString(isDari ? "fa-AF" : undefined, {
    maximumFractionDigits: 10,
  });
const date = (value, isDari) => {
  if (!value) return "-";
  const formatted = String(value).slice(0, 10);
  return isDari
    ? formatted.replace(/[0-9]/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[digit])
    : formatted;
};

export default function VendorActivity() {
  const { t, i18n } = useTranslation();
  const isDari = (i18n.resolvedLanguage || i18n.language).startsWith("prs");
  const printRef = useRef(null);

  const [vendors, setVendors] = useState([]);
  const [vendorName, setVendorName] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getVendors()
      .then((response) => setVendors(response?.data || []))
      .catch((err) => setError(err.message || "failedToLoadVendors"));
  }, []);

  const suggestions = useMemo(() => {
    const query = vendorName.trim().toLowerCase();

    if (!query) {
      return [];
    }

    return vendors.filter((vendor) =>
      vendor.vendor_name.toLowerCase().includes(query),
    );
  }, [vendors, vendorName]);

  async function searchVendor(vendorId) {
    if (!fromDate || !toDate) {
      setError("activityDateRangeRequired");
      return;
    }
    if (!vendorId) {
      setError("chooseVendorFromList");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await getVendorActivity({
        vendorId,
        fromDate,
        toDate,
      });
      setResult(response?.data || null);
    } catch (err) {
      setResult(null);
      setError(err.message || "failedToLoadVendorActivity");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    searchVendor(vendorId);
  }

  const purchases = result?.purchases?.rows || [];
  const payments = result?.payments?.rows || [];
  const account = result?.account;

  return (
    <div className="min-w-0 space-y-5 sm:space-y-6">
      <PageHeader
        title={t("vendorActivity")}
        description={t("vendorActivityDescription")}
      />
      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-xl border bg-card p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4"
      >
        <div className="space-y-2">
          <Label htmlFor="vendor-from-date">{t("fromDate")}</Label>
          <Input
            id="vendor-from-date"
            type="date"
            value={fromDate}
            onChange={(event) => setFromDate(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vendor-to-date">{t("toDate")}</Label>
          <Input
            id="vendor-to-date"
            type="date"
            value={toDate}
            onChange={(event) => setToDate(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vendor-activity-vendor">{t("vendor")}</Label>
          <Input
            id="vendor-activity-vendor"
            type="text"
            placeholder={t("searchByVendorName")}
            value={vendorName}
            onChange={(event) => {
              setVendorName(event.target.value);
              setVendorId("");
              setResult(null);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" && suggestions.length > 0) {
                event.preventDefault();

                const vendor = suggestions[0];
                setVendorId(String(vendor.vendor_id));
                setVendorName(vendor.vendor_name);
                searchVendor(vendor.vendor_id);
              }
            }}
            autoComplete="off"
          />
        </div>
        <div className="flex items-end">
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? t("searching") : t("search")}
          </Button>
        </div>
      </form>

      {suggestions.length > 0 && (
        <section className="rounded-xl border bg-card p-4 shadow-sm">
          <h2 className="mb-3 text-base font-semibold">{t("chooseVendor")}</h2>
          <div className="space-y-2">
            {suggestions.map((vendor) => (
              <Button
                key={vendor.vendor_id}
                type="button"
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  setVendorId(String(vendor.vendor_id));
                  setVendorName(vendor.vendor_name);
                  searchVendor(vendor.vendor_id);
                }}
              >
                {vendor.vendor_name}
              </Button>
            ))}
          </div>
        </section>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {t(error, { defaultValue: error })}
        </div>
      )}
      {result && (
        <>
          <section className="rounded-xl border bg-card p-4 shadow-sm">
            <h2 className="text-lg font-semibold">
              {result.vendor.vendor_name}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("reportingPeriod", {
                from: date(result.period.fromDate, isDari),
                to: date(result.period.toDate, isDari),
              })}
            </p>
            <p className="mt-2 text-sm">
              {result.vendor.email || result.vendor.address || ""}
            </p>
          </section>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <ReportCard
              title={t("purchasesInPeriod")}
              value={result.purchases.total_afn}
              suffix={isDari ? t("currencyAFN") : "AFN"}
            />
            <ReportCard
              title={t("allPayments")}
              value={result.payments.total_afn}
              suffix={isDari ? t("currencyAFN") : "AFN"}
            />
            <ReportCard
              title={t("totalPurchases")}
              value={account.total_purchases_afn}
              suffix={isDari ? t("currencyAFN") : "AFN"}
            />
            <ReportCard
              title={
                account.status === "vendor_credit"
                  ? t("vendorCredit")
                  : account.status === "settled"
                    ? t("accountSettled")
                    : t("owedToVendor")
              }
              value={Math.abs(account.outstanding_afn)}
              suffix={isDari ? t("currencyAFN") : "AFN"}
            />
          </div>
          <div ref={printRef} className="space-y-5">
            <ReportTable
              title={t("purchasesInPeriod")}
              emptyMessage={t("noPurchasesInDateRange")}
              formatNumbers
              columns={[
                { key: "purchase_id", label: t("purchaseNumber") },
                {
                  key: "purchase_date",
                  label: t("date"),
                  render: (row) => date(row.purchase_date, isDari),
                },
                { key: "currency_code", label: t("currency") },
                {
                  key: "total_original",
                  label: t("purchaseTotal"),
                  render: (row) => money(row.total_original, isDari),
                },
                {
                  key: "total_afn",
                  label: t("totalAFN"),
                  render: (row) => money(row.total_afn, isDari),
                },
              ]}
              data={purchases}
            />
            <ReportTable
              title={t("allPayments")}
              emptyMessage={t("noVendorPayments")}
              formatNumbers
              columns={[
                { key: "payment_id", label: t("paymentNumber") },
                {
                  key: "payment_date",
                  label: t("date"),
                  render: (row) => date(row.payment_date, isDari),
                },
                {
                  key: "purchase_id",
                  label: t("purchaseNumber"),
                  render: (row) =>
                    row.purchase_id == null
                      ? t("unallocated")
                      : number(row.purchase_id, isDari),
                },
                { key: "currency_code", label: t("currency") },
                {
                  key: "amount_original",
                  label: t("payment"),
                  render: (row) => money(row.amount_original, isDari),
                },
                {
                  key: "amount_afn",
                  label: t("amountAFN"),
                  render: (row) => money(row.amount_afn, isDari),
                },
                {
                  key: "vendor_mismatch",
                  label: t("vendorLink"),
                  render: (row) =>
                    row.vendor_mismatch ? t("mismatch") : t("ok"),
                },
              ]}
              data={payments}
            />
          </div>
          {account.status === "vendor_credit" && (
            <p className="text-sm text-muted-foreground">
              {t("paymentsExceedPurchases", {
                amount: money(Math.abs(account.outstanding_afn), isDari),
                currency: isDari ? t("currencyAFN") : "AFN",
              })}
            </p>
          )}
          <PrintButton
            contentRef={printRef}
            title={t("printSaveActivity")}
            documentTitle={`Vendor-Activity-${result.vendor.vendor_name}`}
          />
        </>
      )}
    </div>
  );
}
