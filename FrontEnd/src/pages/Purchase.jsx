import { useEffect, useState } from "react";

import {
  getPurchases,
  updatePurchase,
  createPurchase,
  deletePurchase,
} from "@/services/Purchase";

import { getCurrency } from "@/services/Currency";
import { getVendors } from "@/services/Vendor";
import { getItems } from "@/services/Items";

import {
  getPurchaseDetails,
  createPurchaseDetail,
  updatePurchaseDetail,
  deletePurchaseDetail,
} from "@/services/PurchaseDetails";

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

  const [purchaseDetails, setPurchaseDetails] =
    useState([]);

  const [currencies, setCurrencies] = useState([]);

  const [vendors, setVendors] = useState([]);

  const [items, setItems] = useState([]);


  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  const [loading, setLoading] = useState(true);

  const [formLoading, setFormLoading] =
    useState(false);

  const [deleteLoading, setDeleteLoading] =
    useState(false);


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

  const [formOpen, setFormOpen] =
    useState(false);

  const [selectedPurchase, setSelectedPurchase] =
    useState(null);


  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  const [deleteOpen, setDeleteOpen] =
    useState(false);

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
        itemsResponse,
        purchaseDetailsResponse,
      ] = await Promise.all([

        getPurchases(),

        getCurrency(),

        getVendors(),

        getItems(),

        getPurchaseDetails(),

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

      setItems(
        itemsResponse?.data || []
      );

      setPurchaseDetails(
        purchaseDetailsResponse?.data || []
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

  async function handlePurchaseSubmit({
    purchaseData,
    details,
  }) {

    try {

      setFormLoading(true);
      setError("");


      // ==================================================
      // CREATE PURCHASE
      // ==================================================

      if (!selectedPurchase) {

       const response = await createPurchase(purchaseData);

          const purchaseId =
            response?.insertedId ??
            response?.insertId ??
            response?.data?.insertedId ??
            response?.data?.insertId;

          if (!purchaseId) {
            throw new Error(
              "Purchase was created, but purchase ID was not returned."
            );
          }
        // -----------------------------------------------
        // CREATE PURCHASE DETAILS
        // -----------------------------------------------

        for (const detail of details) {

          await createPurchaseDetail({

            purchase_id:
              Number(purchaseId),

            item_id:
              Number(detail.item_id),

            quantity:
              Number(detail.quantity),

            unit_price:
              Number(detail.unit_price),

          });

        }

      }


      // ==================================================
      // UPDATE PURCHASE
      // ==================================================

      else {

        const purchaseId =
          selectedPurchase.purchase_id;


        // -----------------------------------------------
        // UPDATE PURCHASE HEADER
        // -----------------------------------------------

        await updatePurchase(
          purchaseId,
          purchaseData
        );


        // -----------------------------------------------
        // OLD DETAILS
        // -----------------------------------------------

        const oldDetails =
          purchaseDetails.filter(
            (detail) =>
              Number(detail.purchase_id) ===
              Number(purchaseId)
          );


        // -----------------------------------------------
        // CURRENT DETAIL IDS
        // -----------------------------------------------

        const currentDetailIds =
          details
            .filter(
              (detail) =>
                detail.detail_id
            )
            .map(
              (detail) =>
                Number(detail.detail_id)
            );


        // -----------------------------------------------
        // DELETE REMOVED DETAILS
        // -----------------------------------------------

        for (const oldDetail of oldDetails) {

          const stillExists =
            currentDetailIds.includes(
              Number(oldDetail.detail_id)
            );


          if (!stillExists) {

            await deletePurchaseDetail(
              oldDetail.detail_id
            );

          }

        }


        // -----------------------------------------------
        // UPDATE / CREATE DETAILS
        // -----------------------------------------------

        for (const detail of details) {


          // Existing detail
          if (detail.detail_id) {

            await updatePurchaseDetail(

              detail.detail_id,

              {
                item_id:
                  Number(detail.item_id),

                quantity:
                  Number(detail.quantity),

                unit_price:
                  Number(detail.unit_price),
              }

            );

          }


          // New detail
          else {

            await createPurchaseDetail({

              purchase_id:
                Number(purchaseId),

              item_id:
                Number(detail.item_id),

              quantity:
                Number(detail.quantity),

              unit_price:
                Number(detail.unit_price),

            });

          }

        }

      }


      // -----------------------------------------------
      // RELOAD
      // -----------------------------------------------

      await loadData();


      // -----------------------------------------------
      // CLOSE FORM
      // -----------------------------------------------

      setFormOpen(false);

      setSelectedPurchase(null);


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
  // DELETE PURCHASE
  // --------------------------------------------------

  async function handleDelete() {

    if (!purchaseToDelete) {
      return;
    }


    try {

      setDeleteLoading(true);
      setError("");


      // -----------------------------------------------
      // DELETE DETAILS FIRST
      // -----------------------------------------------

      const detailsToDelete =
        purchaseDetails.filter(
          (detail) =>
            Number(detail.purchase_id) ===
            Number(
              purchaseToDelete.purchase_id
            )
        );


      for (const detail of detailsToDelete) {

        await deletePurchaseDetail(
          detail.detail_id
        );

      }


      // -----------------------------------------------
      // DELETE PURCHASE HEADER
      // -----------------------------------------------

      await deletePurchase(
        purchaseToDelete.purchase_id
      );


      // -----------------------------------------------
      // RELOAD
      // -----------------------------------------------

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

  const currencyMap =
    Object.fromEntries(

      currencies.map(
        (currency) => [

          currency.currency_id,

          currency.currency_code,

        ]
      )

    );


  const vendorMap =
    Object.fromEntries(

      vendors.map(
        (vendor) => [

          vendor.vendor_id,

          vendor.vendor_name,

        ]
      )

    );


  // --------------------------------------------------
  // PREPARE ITEM COUNTS
  // --------------------------------------------------

  const purchaseItemCountMap =
    purchaseDetails.reduce(
      (map, detail) => {

        const purchaseId =
          Number(detail.purchase_id);

        map[purchaseId] =
          (map[purchaseId] || 0) + 1;

        return map;

      },
      {}
    );


  // --------------------------------------------------
  // PREPARE TABLE DATA
  // --------------------------------------------------

  const tablePurchases =
    purchases.map((purchase) => ({

      ...purchase,


      purchase_date_display:
        purchase.purchase_date
          ? new Date(
              purchase.purchase_date
            )
              .toISOString()
              .split("T")[0]
          : "-",


      currency_code_display:
        currencyMap[purchase.currency_id] ||
        "-",


      vendor_name_display:
        vendorMap[purchase.vendor_id] ||
        "-",


      item_count_display:
        purchaseItemCountMap[
          Number(purchase.purchase_id)
        ] || 0,

    }));


  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const searchValue =
    search.toLowerCase().trim();


  const filteredPurchases =
    tablePurchases.filter(
      (purchase) => {

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
            purchase.purchase_date_display || ""
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

      }
    );


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
      key: "item_count_display",
      label: "Items",
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

  const { user } =
    useAuth();

  const role =
    user?.role;


  const canCreate =
    [
      "user",
      "manager",
      "admin",
    ].includes(role);


  const canUpdate =
    [
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

        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">

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
                      handleDeleteClick(
                        purchase
                      )
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

              {selectedPurchase
                ? "Edit Purchase"
                : "Add Purchase"}

            </DialogTitle>

            <DialogDescription>

              {selectedPurchase
                ? "Update purchase information and its items."
                : "Enter purchase information and add its items."}

            </DialogDescription>

          </DialogHeader>


          <PurchaseForm

            purchase={
              selectedPurchase
            }

            currencies={
              currencies
            }

            vendors={
              vendors
            }

            items={
              items
            }

            purchaseDetails={
              purchaseDetails
            }

            onSubmit={
              handlePurchaseSubmit
            }

            loading={
              formLoading
            }

          />

        </DialogContent>

      </Dialog>


      {/* DELETE */}

      <DeleteDialog

        open={
          deleteOpen
        }

        onOpenChange={
          setDeleteOpen
        }

        onConfirm={
          handleDelete
        }

        loading={
          deleteLoading
        }

        name={
          `Purchase #${
            purchaseToDelete?.purchase_id ?? ""
          }`
        }

        tableName="Purchase"

      />

    </div>

  );

}