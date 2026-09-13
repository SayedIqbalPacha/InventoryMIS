import { useEffect, useState } from "react";

import {
  getExchangeRates,
  createExchangeRate,
  updateExchangeRate,
  deleteExchangeRate,
} from "@/services/ExchangeRate";

import { getCurrency } from "@/services/Currency";

import { useAuth } from "@/contexts/AuthContext";

import ExchangeRateForm from "@/component/ExchangeRate";

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
// EXCHANGE RATE PAGE
// --------------------------------------------------

export default function ExchangeRatePage() {
  // --------------------------------------------------
  // DATA
  // --------------------------------------------------

  const [exchangeRates, setExchangeRates] = useState([]);

  const [currencies, setCurrencies] = useState([]);

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

  const [selectedExchangeRate, setSelectedExchangeRate] = useState(null);

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [exchangeRateToDelete, setExchangeRateToDelete] = useState(null);

  // --------------------------------------------------
  // LOAD DATA
  // --------------------------------------------------

  async function loadData() {
    try {
      setLoading(true);

      setError("");

      const [exchangeRatesResponse, currenciesResponse] = await Promise.all([
        getExchangeRates(),
        getCurrency(),
      ]);

      setExchangeRates(exchangeRatesResponse?.data || []);

      setCurrencies(currenciesResponse?.data || []);
    } catch (err) {
      setError(err?.message || "Failed to load exchange rates.");
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

  async function handleExchangeRateSubmit(data) {
    try {
      setFormLoading(true);

      setError("");

      if (selectedExchangeRate) {
        await updateExchangeRate(
          selectedExchangeRate.rate_id,

          data,
        );
      } else {
        await createExchangeRate(data);
      }

      await loadData();

      setFormOpen(false);

      setSelectedExchangeRate(null);
    } finally {
      setFormLoading(false);
    }
  }

  // --------------------------------------------------
  // EDIT
  // --------------------------------------------------

  function handleEdit(exchangeRate) {
    setSelectedExchangeRate(exchangeRate);

    setFormOpen(true);
  }

  // --------------------------------------------------
  // DELETE DIALOG
  // --------------------------------------------------

  function handleDeleteClick(exchangeRate) {
    setExchangeRateToDelete(exchangeRate);

    setDeleteOpen(true);
  }

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  async function handleDelete() {
    if (!exchangeRateToDelete) {
      return;
    }

    try {
      setDeleteLoading(true);

      setError("");

      await deleteExchangeRate(exchangeRateToDelete.rate_id);

      await loadData();

      setDeleteOpen(false);

      setExchangeRateToDelete(null);
    } catch (err) {
      setError(err?.message || "Failed to delete exchange rate.");
    } finally {
      setDeleteLoading(false);
    }
  }

  // --------------------------------------------------
  // LOOKUP MAP
  // --------------------------------------------------

  const currencyMap = Object.fromEntries(
    currencies.map((currency) => [
      currency.currency_id,

      currency.currency_code,
    ]),
  );

  // --------------------------------------------------
  // PREPARE TABLE DATA
  // --------------------------------------------------

  const tableExchangeRates = exchangeRates.map((exchangeRate) => ({
    ...exchangeRate,

    from_currency_display: currencyMap[exchangeRate.from_currency_id] || "-",

    to_currency_display: currencyMap[exchangeRate.to_currency_id] || "-",

    effective_date_display: exchangeRate.effective_date
      ? new Date(exchangeRate.effective_date).toISOString().split("T")[0]
      : "-",
  }));

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const searchValue = search.toLowerCase().trim();

  const filteredExchangeRates = tableExchangeRates.filter((exchangeRate) => {
    return (
      String(exchangeRate.rate_id || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(exchangeRate.from_currency_display || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(exchangeRate.to_currency_display || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(exchangeRate.exchange_rate || "")
        .toLowerCase()
        .includes(searchValue) ||
      String(exchangeRate.effective_date_display || "")
        .toLowerCase()
        .includes(searchValue)
    );
  });

  // --------------------------------------------------
  // TABLE COLUMNS
  // --------------------------------------------------

  const columns = [
    {
      key: "rate_id",
      label: "ID",
    },

    {
      key: "from_currency_display",
      label: "From Currency",
    },

    {
      key: "to_currency_display",
      label: "To Currency",
    },

    {
      key: "exchange_rate",
      label: "Exchange Rate",
    },

    {
      key: "effective_date_display",
      label: "Effective Date",
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
        title="Exchange Rates"

        description="Manage currency exchange rates"
      >
        {canCreate && (
          <Button
            className="w-full sm:w-auto"

            onClick={() => {
              setSelectedExchangeRate(null);

              setFormOpen(true);

              setError("");
            }}
          >
            Add Exchange Rate
          </Button>
        )}
      </PageHeader>

      {/* SERVER ERROR */}

      {error && (
        <div
          className="
            rounded-md
            border
            border-destructive/50
            bg-destructive/10
            p-3
            text-sm
            text-destructive
          "
        >
          {error}
        </div>
      )}

      {/* SEARCH */}

      <div className="w-full sm:max-w-sm">
        <Input
          value={search}

          onChange={(event) => setSearch(event.target.value)}

          placeholder="Search exchange rates..."
        />
      </div>

      {/* TABLE */}

      {loading ? (
        <div className="py-10 text-center text-muted-foreground">
          Loading exchange rates...
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          <GeneralTable
            columns={columns}

            data={filteredExchangeRates}

            getRowId={(exchangeRate) => exchangeRate.rate_id}

            actions={(exchangeRate) => (
              <div className="flex flex-wrap justify-end gap-2">
                {/* UPDATE */}

                {canUpdate && (
                  <Button
                    variant="outline"

                    size="sm"

                    onClick={() => handleEdit(exchangeRate)}
                  >
                    Edit
                  </Button>
                )}

                {/* DELETE */}

                {canDelete && (
                  <Button
                    variant="destructive"

                    size="sm"

                    onClick={() => handleDeleteClick(exchangeRate)}
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
            setSelectedExchangeRate(null);
          }
        }}
      >
        <DialogContent
          className="
            w-[calc(100%-2rem)]
            max-w-[750px]
            max-h-[90vh]
            overflow-y-auto
            sm:w-full
          "
        >
          <DialogHeader>
            <DialogTitle>
              {selectedExchangeRate
                ? "Edit Exchange Rate"
                : "Add Exchange Rate"}
            </DialogTitle>

            <DialogDescription>
              {selectedExchangeRate
                ? "Update exchange rate information."
                : "Enter exchange rate information."}
            </DialogDescription>
          </DialogHeader>

          <ExchangeRateForm
            exchangeRate={selectedExchangeRate}

            currencies={currencies}

            onSubmit={handleExchangeRateSubmit}

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

        name={`Rate #${exchangeRateToDelete?.rate_id ?? ""}`}

        tableName="Exchange Rate"
      />
    </div>
  );
}
