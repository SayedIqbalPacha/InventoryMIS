import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  getVendorPayments,
  updateVendorPayment,
  createVendorPayment,
  deleteVendorPayment,
} from "@/services/VendorPayment";

import { getPurchases } from "@/services/Purchase";
import { getCurrency } from "@/services/Currency";
import { getVendors } from "@/services/Vendor";

import { useAuth } from "@/contexts/AuthContext";

import VendorPaymentForm from "@/component/VendorPaymentForm";
import GeneralTable from "@/component/GeneralTable";
import DeleteDialog from "@/component/DeleteDialog";
import PageHeader from "@/component/PageHeader";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Pencil, Trash2 } from "lucide-react";
import { getCurrencyLabel } from "@/lib/getCurrencyLabel";
import {
  formatLocaleDate,
  formatLocaleId,
  formatLocaleNumber,
} from "@/lib/localeFormatters";

export default function VendorPaymentPage() {
  const { t, i18n } = useTranslation();
  const isDari = (i18n.resolvedLanguage || i18n.language).startsWith("prs");
  // --------------------------------------------------
  // DATA
  // --------------------------------------------------

  const [vendorPayments, setVendorPayments] = useState([]);

  const [purchases, setPurchases] = useState([]);

  const [currencies, setCurrencies] = useState([]);

  const [vendors, setVendors] = useState([]);

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  const [loading, setLoading] = useState(true);

  const [formLoading, setFormLoading] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  const [error, setError] = useState("");

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const [search, setSearch] = useState("");

  // --------------------------------------------------
  // FORM
  // --------------------------------------------------

  const [formOpen, setFormOpen] = useState(false);

  const [selectedVendorPayment, setSelectedVendorPayment] = useState(null);

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [paymentToDelete, setPaymentToDelete] = useState(null);

  // --------------------------------------------------
  // LOAD DATA
  // --------------------------------------------------

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [
        vendorPaymentsResponse,
        purchasesResponse,
        currenciesResponse,
        vendorsResponse,
      ] = await Promise.all([
        getVendorPayments(),
        getPurchases(),
        getCurrency(),
        getVendors(),
      ]);

      /*
       * IMPORTANT:
       * Vendor Payment API returns:
       *
       * data: {
       *   vendorPayments: rows
       * }
       *
       * unlike some of your other list endpoints.
       */

      setVendorPayments(vendorPaymentsResponse?.data?.vendorPayments || []);

      setPurchases(purchasesResponse?.data || []);

      setCurrencies(currenciesResponse?.data || []);

      setVendors(vendorsResponse?.data || []);
    } catch {
      setError("failedToLoadVendorPayments");
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------------------------
  // INITIAL FETCH
  // --------------------------------------------------

  useEffect(() => {
    loadData();
  }, []);

  // --------------------------------------------------
  // CREATE / UPDATE
  // --------------------------------------------------

  async function handleVendorPaymentSubmit(data) {
    try {
      setFormLoading(true);
      setError("");

      if (selectedVendorPayment) {
        await updateVendorPayment(selectedVendorPayment.payment_id, data);
      } else {
        await createVendorPayment(data);
      }

      await loadData();

      setFormOpen(false);
      setSelectedVendorPayment(null);
    } finally {
      setFormLoading(false);
    }
  }

  // --------------------------------------------------
  // EDIT
  // --------------------------------------------------

  function handleEdit(vendorPayment) {
    setSelectedVendorPayment(vendorPayment);
    setFormOpen(true);
  }

  // --------------------------------------------------
  // DELETE DIALOG
  // --------------------------------------------------

  function handleDeleteClick(vendorPayment) {
    setPaymentToDelete(vendorPayment);
    setDeleteOpen(true);
  }

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  async function handleDelete() {
    if (!paymentToDelete) {
      return;
    }

    try {
      setDeleteLoading(true);
      setError("");

      await deleteVendorPayment(paymentToDelete.payment_id);

      await loadData();

      setDeleteOpen(false);
      setPaymentToDelete(null);
    } catch {
      setError("failedToDeleteVendorPayment");
    } finally {
      setDeleteLoading(false);
    }
  }

  // --------------------------------------------------
  // LOOKUP MAPS
  // --------------------------------------------------

  const purchaseMap = Object.fromEntries(
    purchases.map((purchase) => [
      purchase.purchase_id,
      t("purchaseNumberWithId", {
        id: formatLocaleId(purchase.purchase_id, isDari),
      }),
    ]),
  );

  const currencyMap = Object.fromEntries(
    currencies.map((currency) => [
      currency.currency_id,
      getCurrencyLabel(currency.currency_code, t),
    ]),
  );

  const vendorMap = Object.fromEntries(
    vendors.map((vendor) => [vendor.vendor_id, vendor.vendor_name]),
  );

  // --------------------------------------------------
  // PREPARE TABLE DATA
  // --------------------------------------------------

  const tableVendorPayments = vendorPayments.map((payment) => ({
    ...payment,

    purchase_display:
      payment.purchase_id != null
        ? purchaseMap[payment.purchase_id] || "-"
        : "-",

    currency_code_display: currencyMap[payment.currency_id] || "-",

    vendor_name_display:
      payment.vendor_id != null ? vendorMap[payment.vendor_id] || "-" : "-",

    amount_display: formatLocaleNumber(payment.amount, isDari),

    payment_date_display: formatLocaleDate(payment.payment_date, isDari),
  }));

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const searchValue = search.toLowerCase().trim();

  const filteredVendorPayments = tableVendorPayments.filter((payment) => {
    return (
      String(payment.payment_id || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(payment.purchase_display || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(payment.currency_code_display || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(payment.amount_display || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(payment.payment_date_display || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(payment.vendor_name_display || "")
        .toLowerCase()
        .includes(searchValue)
    );
  });

  // --------------------------------------------------
  // TABLE COLUMNS
  // --------------------------------------------------

  const columns = [
    {
      key: "payment_id",
      label: t("id"),
    },

    {
      key: "purchase_display",
      label: t("purchase"),
    },

    {
      key: "currency_code_display",
      label: t("currency"),
    },

    {
      key: "amount_display",
      label: t("amount"),
    },

    {
      key: "payment_date_display",
      label: t("paymentDate"),
    },

    {
      key: "vendor_name_display",
      label: t("vendor"),
    },
  ];

  // --------------------------------------------------
  // ROLE
  // --------------------------------------------------

  const { user } = useAuth();

  const role = user?.role;

  const canCreate = ["user", "manager", "admin"].includes(role);

  const canUpdate = ["manager", "admin"].includes(role);

  const canDelete = role === "admin";

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* HEADER */}

      <PageHeader
        title={t("vendorPayments")}
        description={t("manageVendorPayments")}
      >
        {canCreate && (
          <Button
            className="w-full sm:w-auto"
            onClick={() => {
              setSelectedVendorPayment(null);
              setFormOpen(true);
              setError("");
            }}
          >
            {t("addVendorPayment")}
          </Button>
        )}
      </PageHeader>

      {/* SERVER ERROR */}

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive sm:p-4">
          {t(error)}
        </div>
      )}

      {/* SEARCH */}

      <div className="w-full sm:max-w-sm">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t("searchVendorPayments")}
        />
      </div>

      {/* TABLE */}

      {loading ? (
        <div className="py-10 text-center text-muted-foreground">
          {t("loadingVendorPayments")}
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <GeneralTable
            columns={columns}
            data={filteredVendorPayments}
            getRowId={(payment) => payment.payment_id}
            actions={(payment) => (
              <div className="flex flex-wrap justify-end gap-2">
                {/* UPDATE */}

                {canUpdate && (
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label={t("editPayment")}
                    onClick={() => handleEdit(payment)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}

                {/* DELETE */}

                {canDelete && (
                  <Button
                    variant="destructive"
                    size="sm"
                    aria-label={t("deletePayment")}
                    onClick={() => handleDeleteClick(payment)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          />
        </div>
      )}

      {/* CREATE / UPDATE */}

      <Dialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);

          if (!open) {
            setSelectedVendorPayment(null);
          }
        }}
      >
        <DialogContent
          className=" w-[calc(100%-2rem)]
          max-w-4xl
          max-h-[90vh]
          overflow-y-auto
          sm:max-w-5xl
                       "
        >
          <DialogHeader>
            <DialogTitle>
              {selectedVendorPayment
                ? t("editVendorPayment")
                : t("addVendorPayment")}
            </DialogTitle>

            <DialogDescription>
              {selectedVendorPayment
                ? t("updateVendorPaymentInfo")
                : t("enterVendorPaymentInfo")}
            </DialogDescription>
          </DialogHeader>

          <VendorPaymentForm
            vendorPayment={selectedVendorPayment}
            purchases={purchases}
            currencies={currencies}
            vendors={vendors}
            onSubmit={handleVendorPaymentSubmit}
            loading={formLoading}
          />
        </DialogContent>
      </Dialog>

      {/* DELETE */}

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        loading={deleteLoading}
        name={t("vendorPaymentNumber", {
          id: formatLocaleId(paymentToDelete?.payment_id, isDari, ""),
        })}
        tableName={t("vendorPayment")}
      />
    </div>
  );
}
