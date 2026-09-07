import { useEffect, useState } from "react";

import {
  getCurrency,
  updateCurrency,
  createCurrency,
  deleteCurrency,
} from "@/services/Currency";

import { useAuth } from "@/contexts/AuthContext";

import CurrencyForm from "@/component/CurrencyForm";
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
// CURRENCY PAGE
// --------------------------------------------------

export default function CurrencyPage() {

  // DATA
  const [currencies, setCurrencies] = useState([]);

  // LOADING
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ERROR
  const [error, setError] = useState("");

  // SEARCH
  const [search, setSearch] = useState("");

  // FORM
  const [formOpen, setFormOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(null);

  // DELETE
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currencyToDelete, setCurrencyToDelete] = useState(null);


  // --------------------------------------------------
  // LOAD CURRENCIES
  // --------------------------------------------------

  async function loadCurrencies() {

    try {

      setLoading(true);
      setError("");

      const response = await getCurrency();

      setCurrencies(response.data || []);

    } catch (err) {

      setError(
        err.message ||
        "Failed to load currencies."
      );

    } finally {

      setLoading(false);

    }
  }


  // --------------------------------------------------
  // INITIAL FETCH
  // --------------------------------------------------

  useEffect(() => {

    loadCurrencies();

  }, []);


  // --------------------------------------------------
  // CREATE / UPDATE
  // --------------------------------------------------

  async function handleCurrencySubmit(data) {

    try {

      setFormLoading(true);
      setError("");

      if (selectedCurrency) {

        await updateCurrency(
          selectedCurrency.currency_id,
          data
        );

      } else {

        await createCurrency(data);

      }

      await loadCurrencies();

      setFormOpen(false);
      setSelectedCurrency(null);

    } catch (err) {

      throw err;

    } finally {

      setFormLoading(false);

    }
  }


  // --------------------------------------------------
  // EDIT
  // --------------------------------------------------

  function handleEdit(currency) {

    setSelectedCurrency(currency);
    setFormOpen(true);

  }


  // --------------------------------------------------
  // DELETE DIALOG
  // --------------------------------------------------

  function handleDeleteClick(currency) {

    setCurrencyToDelete(currency);
    setDeleteOpen(true);

  }


  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  async function handleDelete() {

    if (!currencyToDelete) {
      return;
    }

    try {

      setDeleteLoading(true);
      setError("");

      await deleteCurrency(
        currencyToDelete.currency_id
      );

      await loadCurrencies();

      setDeleteOpen(false);
      setCurrencyToDelete(null);

    } catch (err) {

      setError(
        err.message ||
        "Failed to delete currency."
      );

    } finally {

      setDeleteLoading(false);

    }
  }


  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const searchValue = search
    .toLowerCase()
    .trim();

  const filteredCurrencies =
    currencies.filter((currency) => {

      return String(
        currency.currency_code || ""
      )
        .toLowerCase()
        .includes(searchValue);

    });


  // --------------------------------------------------
  // TABLE COLUMNS
  // --------------------------------------------------

  const columns = [

    {
      key: "currency_code",
      label: "Currency Code",
    },
    {
      key:"currency_id",
      label:"currency_id",
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

  const canDelete = role === "admin";


  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (

    <div className="space-y-4 sm:space-y-6">


      {/* HEADER */}

      <PageHeader
        title="Currencies"
        description="Manage your currencies"
      >

        {canCreate && (

          <Button
            className="w-full sm:w-auto"
            onClick={() => {

              setSelectedCurrency(null);
              setFormOpen(true);
              setError("");

            }}
          >
            Add Currency
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
          placeholder="Search currency..."
        />

      </div>


      {/* TABLE */}

      {loading ? (

        <div className="py-10 text-center text-muted-foreground">
          Loading currencies...
        </div>

      ) : (

        <div className="w-full overflow-x-auto">

          <GeneralTable
            columns={columns}
            data={filteredCurrencies}
            getRowId={(currency) =>
              currency.currency_id
            }
            actions={(currency) => (

              <div className="flex flex-wrap justify-end gap-2">

                {/* UPDATE */}

                {canUpdate && (

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleEdit(currency)
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
                      handleDeleteClick(currency)
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
            setSelectedCurrency(null);
          }

        }}
      >

        <DialogContent className="w-[calc(100%-2rem)] max-w-[600px] sm:w-full">

          <DialogHeader>

            <DialogTitle>

              {selectedCurrency
                ? "Edit Currency"
                : "Add Currency"}

            </DialogTitle>

            <DialogDescription>

              {selectedCurrency
                ? "Update currency information."
                : "Enter currency information."}

            </DialogDescription>

          </DialogHeader>


          <CurrencyForm
            currency={selectedCurrency}
            onSubmit={handleCurrencySubmit}
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
        name={currencyToDelete?.currency_code}
        tableName="Currency"
      />

    </div>

  );
}
