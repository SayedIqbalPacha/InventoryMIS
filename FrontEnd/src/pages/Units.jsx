import { useEffect, useState } from "react";

import {
  getUnits,
  updateUnit,
  createUnit,
  deleteUnit,
} from "@/services/Units";

import { useAuth } from "@/contexts/AuthContext";

import UnitForm from "@/component/UnitForm";
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
// UNIT PAGE
// --------------------------------------------------

export default function UnitsPage() {

  // --------------------------------------------------
  // DATA
  // --------------------------------------------------

  const [units, setUnits] = useState([]);


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
  const [selectedUnit, setSelectedUnit] = useState(null);


  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState(null);


  // --------------------------------------------------
  // LOAD UNITS
  // --------------------------------------------------

  async function loadUnits() {

    try {

      setLoading(true);
      setError("");

      const response = await getUnits();

      setUnits(response?.data || []);

    } catch (err) {

      setError(
        err?.message ||
        "Failed to load units."
      );

    } finally {

      setLoading(false);

    }

  }


  // --------------------------------------------------
  // INITIAL FETCH
  // --------------------------------------------------

  useEffect(() => {

    loadUnits();

  }, []);


  // --------------------------------------------------
  // CREATE / UPDATE
  // --------------------------------------------------

  async function handleUnitSubmit(data) {

    try {

      setFormLoading(true);
      setError("");

      if (selectedUnit) {

        await updateUnit(
          selectedUnit.unit_id,
          data
        );

      } else {

        await createUnit(data);

      }

      await loadUnits();

      setFormOpen(false);
      setSelectedUnit(null);

    } catch (err) {

      throw err;

    } finally {

      setFormLoading(false);

    }

  }


  // --------------------------------------------------
  // EDIT
  // --------------------------------------------------

  function handleEdit(unit) {

    setSelectedUnit(unit);
    setFormOpen(true);

  }


  // --------------------------------------------------
  // DELETE DIALOG
  // --------------------------------------------------

  function handleDeleteClick(unit) {

    setUnitToDelete(unit);
    setDeleteOpen(true);

  }


  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  async function handleDelete() {

    if (!unitToDelete) {
      return;
    }

    try {

      setDeleteLoading(true);
      setError("");

      await deleteUnit(
        unitToDelete.unit_id
      );

      await loadUnits();

      setDeleteOpen(false);
      setUnitToDelete(null);

    } catch (err) {

      setError(
        err?.message ||
        "Failed to delete unit."
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


  const filteredUnits =
    units.filter((unit) => {

      return (

        String(
          unit.unit_name || ""
        )
          .toLowerCase()
          .includes(searchValue)

        ||

        String(
          unit.unit_symbole || ""
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
      key: "unit_id",
      label: "ID",
    },

    {
      key: "unit_name",
      label: "Unit Name",
    },

    {
      key: "unit_symbole",
      label: "Symbol",
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
        title="Units"
        description="Manage your units"
      >

        {canCreate && (

          <Button
            className="w-full sm:w-auto"
            onClick={() => {

              setSelectedUnit(null);
              setFormOpen(true);
              setError("");

            }}
          >
            Add Unit
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
          placeholder="Search unit..."
        />

      </div>


      {/* TABLE */}

      {loading ? (

        <div className="py-10 text-center text-muted-foreground">
          Loading units...
        </div>

      ) : (

        <div className="w-full overflow-x-auto">

          <GeneralTable
            columns={columns}
            data={filteredUnits}
            getRowId={(unit) =>
              unit.unit_id
            }
            actions={(unit) => (

              <div className="flex flex-wrap justify-end gap-2">

                {/* UPDATE */}

                {canUpdate && (

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleEdit(unit)
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
                      handleDeleteClick(unit)
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


      {/* CREATE / UPDATE DIALOG */}

      <Dialog
        open={formOpen}
        onOpenChange={(open) => {

          setFormOpen(open);

          if (!open) {
            setSelectedUnit(null);
          }

        }}
      >

        <DialogContent className="w-[calc(100%-2rem)] max-w-[600px] sm:w-full">

          <DialogHeader>

            <DialogTitle>

              {selectedUnit
                ? "Edit Unit"
                : "Add Unit"}

            </DialogTitle>

            <DialogDescription>

              {selectedUnit
                ? "Update unit information."
                : "Enter unit information."}

            </DialogDescription>

          </DialogHeader>


          <UnitForm
            unit={selectedUnit}
            onSubmit={handleUnitSubmit}
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
        name={unitToDelete?.unit_name}
        tableName="Unit"
      />

    </div>

  );
}

