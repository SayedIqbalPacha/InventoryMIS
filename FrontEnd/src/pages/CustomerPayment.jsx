import { useEffect, useState } from "react";

import {
  getCustomerPayments,
  updateCustomerPayment,
  createCustomerPayment,
  deleteCustomerPayment,
} from "@/services/CustomerPayment";

import { getCustomers } from "@/services/Customer";
import { getCurrency } from "@/services/Currency";
import { getSales } from "@/services/Sales";

import { useAuth } from "@/contexts/AuthContext";

import CustomerPaymentForm from "@/component/CustomerPaymentForm";
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

export default function CustomerPaymentPage() {
  // --------------------------------------------------
  // DATA
  // --------------------------------------------------

  const [customerPayments, setCustomerPayments] = useState([]);

  const [customers, setCustomers] = useState([]);

  const [currencies, setCurrencies] = useState([]);

  const [sales, setSales] = useState([]);

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

  const [selectedCustomerPayment, setSelectedCustomerPayment] = useState(null);

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
        customerPaymentsResponse,
        customersResponse,
        currenciesResponse,
        salesResponse,
      ] = await Promise.all([
        getCustomerPayments(),
        getCustomers(),
        getCurrency(),
        getSales(),
      ]);

      setCustomerPayments(customerPaymentsResponse?.data || []);

      setCustomers(customersResponse?.data || []);

      setCurrencies(currenciesResponse?.data || []);

      setSales(salesResponse?.data || []);
    } catch (err) {
      setError(err?.message || "Failed to load customer payments.");
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

  async function handleCustomerPaymentSubmit(data) {
    try {
      setFormLoading(true);
      setError("");

      if (selectedCustomerPayment) {
        await updateCustomerPayment(
          selectedCustomerPayment.cus_payment_id,
          data,
        );
      } else {
        await createCustomerPayment(data);
      }

      await loadData();

      setFormOpen(false);
      setSelectedCustomerPayment(null);
    } catch (err) {
      throw err;
    } finally {
      setFormLoading(false);
    }
  }

  // --------------------------------------------------
  // EDIT
  // --------------------------------------------------

  function handleEdit(customerPayment) {
    setSelectedCustomerPayment(customerPayment);
    setFormOpen(true);
  }

  // --------------------------------------------------
  // DELETE DIALOG
  // --------------------------------------------------

  function handleDeleteClick(customerPayment) {
    setPaymentToDelete(customerPayment);
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

      await deleteCustomerPayment(paymentToDelete.cus_payment_id);

      await loadData();

      setDeleteOpen(false);
      setPaymentToDelete(null);
    } catch (err) {
      setError(err?.message || "Failed to delete customer payment.");
    } finally {
      setDeleteLoading(false);
    }
  }

  // --------------------------------------------------
  // LOOKUP MAPS
  // --------------------------------------------------

  const customerMap = Object.fromEntries(
    customers.map((customer) => [customer.customer_id, customer.customer_name]),
  );

  const currencyMap = Object.fromEntries(
    currencies.map((currency) => [
      currency.currency_id,
      currency.currency_code,
    ]),
  );

  // --------------------------------------------------
  // PREPARE TABLE DATA
  // --------------------------------------------------

  const tableCustomerPayments = customerPayments.map((payment) => ({
    ...payment,

    // here we pass the customer_id to customerMap to get the customer_name, if not found we display "-"
    customer_name_display: customerMap[payment.customer_id] || "-",

    currency_code_display: currencyMap[payment.currency_id] || "-",

    date_display: payment.date
      ? new Date(payment.date).toISOString().split("T")[0]
      : "-",

    sale_display: payment.sale_id != null ? `Sale #${payment.sale_id}` : "-",
  }));

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const searchValue = search.toLowerCase().trim();

  const filteredCustomerPayments = tableCustomerPayments.filter((payment) => {
    return (
      String(payment.cus_payment_id || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(payment.customer_name_display || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(payment.currency_code_display || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(payment.amount || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(payment.date_display || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(payment.sale_display || "")
        .toLowerCase()
        .includes(searchValue)
    );
  });

  // --------------------------------------------------
  // TABLE COLUMNS
  // --------------------------------------------------

  const columns = [
    {
      key: "cus_payment_id",
      label: "ID",
    },

    {
      key: "customer_name_display",
      label: "Customer",
    },

    {
      key: "currency_code_display",
      label: "Currency",
    },

    {
      key: "amount",
      label: "Amount",
    },

    {
      key: "date_display",
      label: "Date",
    },

    {
      key: "sale_display",
      label: "Sale",
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
        title="Customer Payments"
        description="Manage customer payments"
      >
        {canCreate && (
          <Button
            className="w-full sm:w-auto"
            onClick={() => {
              setSelectedCustomerPayment(null);
              setFormOpen(true);
              setError("");
            }}
          >
            Add Payment
          </Button>
        )}
      </PageHeader>

      {/* SERVER ERROR */}

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive sm:p-4">
          {error}
        </div>
      )}

      {/* SEARCH */}

      <div className="w-full sm:max-w-sm">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search customer payments..."
        />
      </div>

      {/* TABLE */}

      {loading ? (
        <div className="py-10 text-center text-muted-foreground">
          Loading customer payments...
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <GeneralTable
            columns={columns}
            data={filteredCustomerPayments}
            getRowId={(payment) => payment.cus_payment_id}
            actions={(payment) => (
              <div className="flex flex-wrap justify-end gap-2">
                {/* UPDATE */}

                {canUpdate && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(payment)}
                  >
                    Edit
                  </Button>
                )}

                {/* DELETE */}

                {canDelete && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(payment)}
                  >
                    Delete
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
            setSelectedCustomerPayment(null);
          }
        }}
      >
        <DialogContent className="w-[calc(100%-2rem)] max-w-[750px] sm:w-full">
          <DialogHeader>
            <DialogTitle>
              {selectedCustomerPayment
                ? "Edit Customer Payment"
                : "Add Customer Payment"}
            </DialogTitle>

            <DialogDescription>
              {selectedCustomerPayment
                ? "Update customer payment information."
                : "Enter customer payment information."}
            </DialogDescription>
          </DialogHeader>

          <CustomerPaymentForm
            customerPayment={selectedCustomerPayment}
            customers={customers}
            currencies={currencies}
            sales={sales}
            onSubmit={handleCustomerPaymentSubmit}
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
        name={`Customer Payment #${paymentToDelete?.cus_payment_id ?? ""}`}
        tableName="Customer Payment"
      />
    </div>
  );
}
