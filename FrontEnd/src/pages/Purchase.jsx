import { useEffect, useState } from "react";

import {
  getPurchases,
  updatePurchase,
  createPurchase,
  deletePurchase,
} from "@/services/Purchase";

import { getCurrency } from "@/services/Currency";
import { getVendors } from "@/services/Vendor";

import { useAuth } from "@/contexts/AuthContext";

import PurchaseForm from "@/component/PurchaseForm";
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


// --------------------------------------------------
// PURCHASE PAGE
// --------------------------------------------------

export default function PurchasePage() {

  // --------------------------------------------------
  // DATA
  // --------------------------------------------------

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
  const [selectedPurchase, setSelectedPurchase] = useState(null);


  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [purchaseToDelete, setPurchaseToDelete] =
    useState(null);


  // --------------------------------------------------
  // LOAD DATA
  // --------------------------------------------------

  async function loadData() {

    try {

      setLoading(true);
      setError("");

      const [
        purchasesResponse,
        currenciesResponse,
        vendorsResponse,
      ] = await Promise.all([
        getPurchases(),
        getCurrency(),
        getVendors(),
      ]);


      setPurchases(
        purchasesResponse?.data || []
      );

      setCurrencies(
        currenciesResponse?.data || []
      );

      setVendors(
        vendorsResponse?.data || []
      );

    } catch (err) {

      setError(
        err?.message ||
        "Failed to load purchases."
      );

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

  async function handlePurchaseSubmit(data) {

    try {

      setFormLoading(true);
      setError("");

      if (selectedPurchase) {

        await updatePurchase(
          selectedPurchase.purchase_id,
          data
        );

      } else {

        await createPurchase(data);

      }

      await loadData();

      setFormOpen(false);
      setSelectedPurchase(null);

    } catch (err) {

      throw err;

    } finally {

      setFormLoading(false);

    }

  }


  // --------------------------------------------------
  // EDIT
  // --------------------------------------------------

  function handleEdit(purchase) {

    setSelectedPurchase(purchase);
    setFormOpen(true);

  }


  // --------------------------------------------------
  // DELETE DIALOG
  // --------------------------------------------------

  function handleDeleteClick(purchase) {

    setPurchaseToDelete(purchase);
    setDeleteOpen(true);

  }


  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  async function handleDelete() {

    if (!purchaseToDelete) {
      return;
    }

    try {

      setDeleteLoading(true);
      setError("");

      await deletePurchase(
        purchaseToDelete.purchase_id
      );

      await loadData();

      setDeleteOpen(false);
      setPurchaseToDelete(null);

    } catch (err) {

      setError(
        err?.message ||
        "Failed to delete purchase."
      );

    } finally {

      setDeleteLoading(false);

    }

  }


  // --------------------------------------------------
  // LOOKUP MAPS
  // --------------------------------------------------

  const currencyMap = Object.fromEntries(

    currencies.map((currency) => [

      currency.currency_id,

      currency.currency_code,

    ])

  );


  const vendorMap = Object.fromEntries(

    vendors.map((vendor) => [

      vendor.vendor_id,

      vendor.vendor_name,

    ])

  );


  // --------------------------------------------------
  // PREPARE TABLE DATA
  // --------------------------------------------------

  const tablePurchases = purchases.map((purchase) => ({

    ...purchase,


  purchase_date_display:
    purchase.purchase_date
      ? new Date(purchase.purchase_date)
          .toISOString()
          .split("T")[0]
      : "-",

    currency_code_display:
      currencyMap[purchase.currency_id] || "-",

    vendor_name_display:
      vendorMap[purchase.vendor_id] || "-",

  }));


  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const searchValue = search
    .toLowerCase()
    .trim();


  const filteredPurchases =
    tablePurchases.filter((purchase) => {

      return (

        String(
          purchase.purchase_id || ""
        )
          .toLowerCase()
          .includes(searchValue)

        ||

        String(
          purchase.currency_code_display || ""
        )
          .toLowerCase()
          .includes(searchValue)

        ||

        String(
          purchase.vendor_name_display || ""
        )
          .toLowerCase()
          .includes(searchValue)

        ||

        String(
          purchase.purchase_date || ""
        )
          .toLowerCase()
          .includes(searchValue)

        ||

        String(
          purchase.total_amount || ""
        )
          .toLowerCase()
          .includes(searchValue)

        ||

        String(
          purchase.status || ""
        )
          .toLowerCase()
          .includes(searchValue)

      );

    });


  // --------------------------------------------------
  // TABLE COLUMNS
  // --------------------------------------------------

  const columns = [

    {
      key: "purchase_id",
      label: "ID",
    },

    {
      key: "currency_code_display",
      label: "Currency",
    },

    {
      key: "vendor_name_display",
      label: "Vendor",
    },

    {
      key: "purchase_date_display",
      label: "Purchase Date",
    },

    {
      key: "total_amount",
      label: "Total Amount",
    },

    {
      key: "status",
      label: "Status",
    },

  ];


  // --------------------------------------------------
  // ROLE
  // --------------------------------------------------

  const { user } = useAuth();

  const role = user?.role;


  const canCreate = [
    "user",
    "manager",
    "admin",
  ].includes(role);


  const canUpdate = [
    "manager",
    "admin",
  ].includes(role);


  const canDelete =
    role === "admin";


  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (

    <div className="space-y-4 sm:space-y-6">


      {/* HEADER */}

      <PageHeader
        title="Purchases"
        description="Manage your purchases"
      >

        {canCreate && (

          <Button
            className="w-full sm:w-auto"
            onClick={() => {

              setSelectedPurchase(null);
              setFormOpen(true);
              setError("");

            }}
          >
            Add Purchase
          </Button>

        )}

      </PageHeader>


      {/* SERVER ERROR */}

      {error && (

        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 sm:p-4 text-sm text-destructive">

          {error}

        </div>

      )}


      {/* SEARCH */}

      <div className="w-full sm:max-w-sm">

        <Input
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search purchases..."
        />

      </div>


      {/* TABLE */}

      {loading ? (

        <div className="py-10 text-center text-muted-foreground">
          Loading purchases...
        </div>

      ) : (

        <div className="w-full overflow-x-auto">

          <GeneralTable
            columns={columns}
            data={filteredPurchases}
            getRowId={(purchase) =>
              purchase.purchase_id
            }
            actions={(purchase) => (

              <div className="flex flex-wrap justify-end gap-2">

                {/* UPDATE */}

                {canUpdate && (

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleEdit(purchase)
                    }
                  >
                    Edit
                  </Button>

                )}


                {/* DELETE */}

                {canDelete && (

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      handleDeleteClick(purchase)
                    }
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
            setSelectedPurchase(null);
          }

        }}
      >

        <DialogContent className="w-[calc(100%-2rem)] max-w-[750px] sm:w-full">

          <DialogHeader>

            <DialogTitle>

              {selectedPurchase
                ? "Edit Purchase"
                : "Add Purchase"}

            </DialogTitle>

            <DialogDescription>

              {selectedPurchase
                ? "Update purchase information."
                : "Enter purchase information."}

            </DialogDescription>

          </DialogHeader>


          <PurchaseForm
            purchase={selectedPurchase}
            currencies={currencies}
            vendors={vendors}
            onSubmit={handlePurchaseSubmit}
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
        name={`Purchase #${purchaseToDelete?.purchase_id ?? ""}`}
        tableName="Purchase"
      />

    </div>

  );

}

