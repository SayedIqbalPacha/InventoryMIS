import { useEffect, useState } from "react";

import {
  getSales,
  updateSales,
  createSales,
  deleteSales,
  getAvailableStock,
} from "@/services/Sales";

import { getCustomers } from "@/services/Customer";
import { getCurrency } from "@/services/Currency";
import { getItems } from "@/services/Items";

import { getSalesDetails } from "@/services/SalesDetails";

import { useAuth } from "@/contexts/AuthContext";

import SalesForm from "@/component/SalesForm";
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

// --------------------------------------------------
// SALES PAGE
// --------------------------------------------------

export default function SalesPage() {
  // --------------------------------------------------
  // DATA
  // --------------------------------------------------

  const [sales, setSales] = useState([]);

  const [customers, setCustomers] = useState([]);

  const [currencies, setCurrencies] = useState([]);

  const [items, setItems] = useState([]);

  const [salesDetails, setSalesDetails] = useState([]);

  const [availableStock, setAvailableStock] = useState([]);
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

  const [selectedSales, setSelectedSales] = useState(null);

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [salesToDelete, setSalesToDelete] = useState(null);

  // --------------------------------------------------
  // LOAD DATA
  // --------------------------------------------------

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [
        salesResponse,
        customersResponse,
        currenciesResponse,
        itemsResponse,
        salesDetailsResponse,
        stockResponse,
      ] = await Promise.all([
        getSales(),

        getCustomers(),

        getCurrency(),

        getItems(),

        getSalesDetails(),

        getAvailableStock(),
      ]);

      setSales(salesResponse?.data || []);

      setCustomers(customersResponse?.data || []);

      setCurrencies(currenciesResponse?.data || []);

      setItems(itemsResponse?.data || []);

      setSalesDetails(salesDetailsResponse?.data || []);

      setAvailableStock(stockResponse?.data || []);
    } catch (err) {
      setError(err?.message || "Failed to load sales.");
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

  async function handleSalesSubmit({ salesData, details }) {
    try {
      setFormLoading(true);
      setError("");

      // ==================================================
      // CREATE
      // ==================================================

      if (!selectedSales) {
        // The backend now creates:
        // 1. Sales
        // 2. All Sales Details
        // 3. All Sale-Purchase Allocations
        //
        // Everything happens inside ONE transaction.

        await createSales({
          ...salesData,
          details,
        });
      }

      // ==================================================
      // UPDATE
      // ==================================================
      else {
        const salesId = selectedSales.sales_id;

        // The backend now updates:
        // 1. Sales header
        // 2. All Sales Details
        // 3. All Sale-Purchase Allocations
        //
        // Old details are replaced and allocations
        // are rebuilt automatically inside ONE transaction.

        await updateSales(salesId, {
          ...salesData,
          details,
        });
      }

      // ==================================================
      // RELOAD
      // ==================================================

      await loadData();

      // ==================================================
      // CLOSE FORM
      // ==================================================

      setFormOpen(false);
      setSelectedSales(null);
    } catch (err) {
      setError(
        err?.message ||
          "Failed to save sale. Please check the information and try again.",
      );

      // Re-throw so SalesForm can also display
      // the server error inside the form.
      throw err;
    } finally {
      setFormLoading(false);
    }
  }

  // --------------------------------------------------
  // EDIT
  // --------------------------------------------------

  function handleEdit(sales) {
    setSelectedSales(sales);

    setFormOpen(true);
  }

  // --------------------------------------------------
  // DELETE DIALOG
  // --------------------------------------------------

  function handleDeleteClick(sales) {
    setSalesToDelete(sales);

    setDeleteOpen(true);
  }

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  async function handleDelete() {
    if (!salesToDelete) {
      return;
    }

    try {
      setDeleteLoading(true);
      setError("");

      // -----------------------------------------------
      // DELETE SALES DETAILS FIRST
      // -----------------------------------------------

      // what if i dont remove it

      // const detailsToDelete = salesDetails.filter(
      //   (detail) => Number(detail.sales_id) === Number(salesToDelete.sales_id),
      // );

      // for (const detail of detailsToDelete) {
      //   await deleteSalesDetail(detail.detail_id);
      // }

      // -----------------------------------------------
      // DELETE SALES HEADER
      // -----------------------------------------------

      await deleteSales(salesToDelete.sales_id);

      // -----------------------------------------------
      // RELOAD
      // -----------------------------------------------

      await loadData();

      setDeleteOpen(false);

      setSalesToDelete(null);
    } catch (err) {
      setError(err?.message || "Failed to delete sales.");
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
  // ITEM COUNT
  // --------------------------------------------------

  const salesItemCountMap = salesDetails.reduce((map, detail) => {
    const salesId = Number(detail.sales_id);

    map[salesId] = (map[salesId] || 0) + 1;

    return map;
  }, {});

  // --------------------------------------------------
  // PREPARE TABLE DATA
  // --------------------------------------------------

  const tableSales = sales.map((sale) => ({
    ...sale,

    customer_name_display: customerMap[sale.customer_id] || "-",

    currency_code_display: currencyMap[sale.currency_id] || "-",

    sales_date_display: sale.sales_date
      ? new Date(sale.sales_date).toISOString().split("T")[0]
      : "-",

    item_count_display: salesItemCountMap[Number(sale.sales_id)] || 0,
  }));

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const searchValue = search.toLowerCase().trim();

  const filteredSales = tableSales.filter((sale) => {
    return (
      String(sale.sales_id || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(sale.customer_name_display || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(sale.currency_code_display || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(sale.sales_date_display || "")
        .toLowerCase()
        .includes(searchValue)
    );
  });

  // --------------------------------------------------
  // TABLE COLUMNS
  // --------------------------------------------------

  const columns = [
    {
      key: "sales_id",
      label: "ID",
    },

    {
      key: "customer_name_display",
      label: "Customer",
    },

    {
      key: "sales_date_display",
      label: "Sales Date",
    },

    {
      key: "currency_code_display",
      label: "Currency",
    },

    {
      key: "item_count_display",
      label: "Items",
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

      <PageHeader title="Sales" description="Manage your sales">
        {canCreate && (
          <Button
            className="w-full sm:w-auto"
            onClick={() => {
              setSelectedSales(null);

              setFormOpen(true);

              setError("");
            }}
          >
            Add Sales
          </Button>
        )}
      </PageHeader>

      {/* SERVER ERROR */}

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* SEARCH */}

      <div className="w-full sm:max-w-sm">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search sales..."
        />
      </div>

      {/* TABLE */}

      {loading ? (
        <div className="py-10 text-center text-muted-foreground">
          Loading sales...
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <GeneralTable
            columns={columns}
            data={filteredSales}
            getRowId={(sale) => sale.sales_id}

            actions={(sale) => (
              <div className="flex flex-wrap justify-end gap-2">
                {/* UPDATE */}

                {canUpdate && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(sale)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}

                {/* DELETE */}

                {canDelete && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(sale)}
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
            setSelectedSales(null);
          }
        }}
      >
        <DialogContent
          className="
            w-[calc(100%-2rem)]
            max-w-5xl
            max-h-[90vh]
            overflow-y-auto
            sm:w-full
          "
        >
          <DialogHeader>
            <DialogTitle>
              {selectedSales ? "Edit Sales" : "Add Sales"}
            </DialogTitle>

            <DialogDescription>
              {selectedSales
                ? "Update sales information and its items."
                : "Enter sales information and add its items."}
            </DialogDescription>
          </DialogHeader>

          <SalesForm
            sales={selectedSales}

            customers={customers}

            currencies={currencies}

            items={items}

            salesDetails={salesDetails}

            availableStock={availableStock}

            onSubmit={handleSalesSubmit}

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

        name={`Sales #${salesToDelete?.sales_id ?? ""}`}

        tableName="Sales"
      />
    </div>
  );
}
