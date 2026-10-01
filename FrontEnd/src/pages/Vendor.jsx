import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { translateApiError } from "@/lib/translateApiError";

import {
  getVendors,
  updateVendor,
  createVendor,
  deleteVendor,
} from "@/services/Vendor";

import { useAuth } from "@/contexts/AuthContext";

import VendorForm from "@/component/VendorForm";
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
// VENDOR PAGE
// --------------------------------------------------

export default function VendorPage() {
  const { t, i18n } = useTranslation();
  // --------------------------------------------------
  // DATA
  // --------------------------------------------------

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
  const [selectedVendor, setSelectedVendor] = useState(null);

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState(null);

  // --------------------------------------------------
  // LOAD VENDORS
  // --------------------------------------------------

  async function loadVendors() {
    try {
      setLoading(true);
      setError("");

      const response = await getVendors();

      setVendors(response?.data || []);
    } catch (err) {
      setError(err?.message || t("failedToLoadVendors"));
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------------------------
  // INITIAL FETCH
  // --------------------------------------------------

  useEffect(() => {
    loadVendors();
  }, []);

  // --------------------------------------------------
  // CREATE / UPDATE
  // --------------------------------------------------

  async function handleVendorSubmit(data) {
    try {
      setFormLoading(true);
      setError("");

      if (selectedVendor) {
        await updateVendor(selectedVendor.vendor_id, data);
      } else {
        await createVendor(data);
      }

      await loadVendors();

      setFormOpen(false);
      setSelectedVendor(null);
    } catch (err) {
      throw err;
    } finally {
      setFormLoading(false);
    }
  }

  // --------------------------------------------------
  // EDIT
  // --------------------------------------------------

  function handleEdit(vendor) {
    setSelectedVendor(vendor);
    setFormOpen(true);
  }

  // --------------------------------------------------
  // DELETE DIALOG
  // --------------------------------------------------

  function handleDeleteClick(vendor) {
    setVendorToDelete(vendor);
    setDeleteOpen(true);
  }

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  async function handleDelete() {
    if (!vendorToDelete) {
      return;
    }

    try {
      setDeleteLoading(true);
      setError("");

      await deleteVendor(vendorToDelete.vendor_id);

      await loadVendors();

      setDeleteOpen(false);
      setVendorToDelete(null);
    } catch (err) {
      setError(err?.message || t("failedToDeleteVendor"));
    } finally {
      setDeleteLoading(false);
    }
  }

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const searchValue = search.toLowerCase().trim();

  const filteredVendors = vendors.filter((vendor) => {
    return (
      String(vendor.vendor_name || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(vendor.email || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(vendor.address || "")
        .toLowerCase()
        .includes(searchValue)
    );
  });

  // --------------------------------------------------
  // TABLE COLUMNS
  // --------------------------------------------------

  const columns = [
    {
      key: "vendor_id",
      label: t("id"),
    },

    {
      key: "vendor_name",
      label: t("vendorName"),
    },

    {
      key: "email",
      label: t("email"),
    },

    {
      key: "address",
      label: t("address"),
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

      <PageHeader title={t("vendors")} description={t("manageVendors")}>
        {canCreate && (
          <Button
            className="w-full sm:w-auto"
            onClick={() => {
              setSelectedVendor(null);
              setFormOpen(true);
              setError("");
            }}
          >
            {t("addVendor")}
          </Button>
        )}
      </PageHeader>

      {/* SERVER ERROR */}

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 sm:p-4 text-sm text-destructive">
          {translateApiError(error, t, i18n, "failedToLoadVendors")}
        </div>
      )}

      {/* SEARCH */}

      <div className="w-full sm:max-w-sm">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t("searchVendors")}
        />
      </div>

      {/* TABLE */}

      {loading ? (
        <div className="py-10 text-center text-muted-foreground">
          {t("loadingVendors")}
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <GeneralTable
            columns={columns}
            data={filteredVendors}
            getRowId={(vendor) => vendor.vendor_id}
            actions={(vendor) => (
              <div className="flex flex-wrap justify-end gap-2">
                {/* UPDATE */}

                {canUpdate && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(vendor)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}

                {/* DELETE */}

                {canDelete && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(vendor)}
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
            setSelectedVendor(null);
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
              {selectedVendor ? t("editVendor") : t("addVendor")}
            </DialogTitle>

            <DialogDescription>
              {selectedVendor
                ? t("updateVendorInfo")
                : t("enterVendorInfo")}
            </DialogDescription>
          </DialogHeader>

          <VendorForm
            vendor={selectedVendor}
            onSubmit={handleVendorSubmit}
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
        name={vendorToDelete?.vendor_name}
        tableName="Vendor"
      />
    </div>
  );
}
