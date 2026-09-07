import { useEffect, useState } from "react";

import {
  getCatagories,
  updateCatagory,
  createCatagory,
  deleteCatagory,
} from "@/services/Catagory";

import { useAuth } from "@/contexts/AuthContext";

import CatagoryForm from "@/component/CatagoryForm";
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
// CATAGORY PAGE
// --------------------------------------------------

export default function Catagory() {

  // DATA
  const [catagories, setCatagories] = useState([]);

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
  const [selectedCatagory, setSelectedCatagory] = useState(null);

  // DELETE
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [catagoryToDelete, setCatagoryToDelete] =
    useState(null);


  // --------------------------------------------------
  // LOAD CATAGORIES
  // --------------------------------------------------

  async function loadCatagories() {

    try {

      setLoading(true);
      setError("");

      const response = await getCatagories();

      setCatagories(response.data || []);

    } catch (err) {

      setError(
        err.message ||
        "Failed to load catagories."
      );

    } finally {

      setLoading(false);

    }

  }


  // --------------------------------------------------
  // INITIAL FETCH
  // --------------------------------------------------

  useEffect(() => {

    loadCatagories();

  }, []);


  // --------------------------------------------------
  // CREATE / UPDATE
  // --------------------------------------------------

  async function handleCatagorySubmit(data) {

    try {

      setFormLoading(true);
      setError("");

      if (selectedCatagory) {

        await updateCatagory(
          selectedCatagory.catagory_id,
          data
        );

      } else {

        await createCatagory(data);

      }

      await loadCatagories();

      setFormOpen(false);
      setSelectedCatagory(null);

    } catch (err) {

      // Send error back to CatagoryForm
      throw err;

    } finally {

      setFormLoading(false);

    }

  }


  // --------------------------------------------------
  // EDIT
  // --------------------------------------------------

  function handleEdit(catagory) {

    setSelectedCatagory(catagory);
    setFormOpen(true);

  }


  // --------------------------------------------------
  // DELETE DIALOG
  // --------------------------------------------------

  function handleDeleteClick(catagory) {

    setCatagoryToDelete(catagory);
    setDeleteOpen(true);

  }


  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  async function handleDelete() {

    if (!catagoryToDelete) {
      return;
    }

    try {

      setDeleteLoading(true);
      setError("");

      await deleteCatagory(
        catagoryToDelete.catagory_id
      );

      await loadCatagories();

      setDeleteOpen(false);
      setCatagoryToDelete(null);

    } catch (err) {

      setError(
        err.message ||
        "Failed to delete catagory."
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


  const filteredCatagories =
    catagories.filter((catagory) => {

      return (

        String(
          catagory.catagory_name || ""
        )
          .toLowerCase()
          .includes(searchValue)

        ||

        String(
          catagory.catagory_description || ""
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
      key: "catagory_id",
      label: "ID",
    },

    {
      key: "catagory_name",
      label: "Catagory Name",
    },

    {
      key: "catagory_description",
      label: "Description",
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
        title="Catagories"
        description="Manage your catagories"
      >

        {canCreate && (

          <Button
            className="w-full sm:w-auto"
            onClick={() => {

              setSelectedCatagory(null);
              setFormOpen(true);
              setError("");

            }}
          >
            Add Catagory
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
          placeholder="Search catagory..."
        />

      </div>


      {/* TABLE */}

      {loading ? (

        <div className="py-10 text-center text-muted-foreground">
          Loading catagories...
        </div>

      ) : (

        <div className="w-full overflow-x-auto">

          <GeneralTable
            columns={columns}
            data={filteredCatagories}
            getRowId={(catagory) =>
              catagory.catagory_id
            }
            actions={(catagory) => (

              <div className="flex flex-wrap justify-end gap-2">

                {/* UPDATE */}

                {canUpdate && (

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleEdit(catagory)
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
                      handleDeleteClick(catagory)
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
            setSelectedCatagory(null);
          }

        }}
      >

        <DialogContent className="w-[calc(100%-2rem)] max-w-[600px] sm:w-full">

          <DialogHeader>

            <DialogTitle>

              {selectedCatagory
                ? "Edit Catagory"
                : "Add Catagory"}

            </DialogTitle>


            <DialogDescription>

              {selectedCatagory
                ? "Update catagory information."
                : "Enter catagory information."}

            </DialogDescription>

          </DialogHeader>


          <CatagoryForm
            catagory={selectedCatagory}
            onSubmit={handleCatagorySubmit}
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
        name={catagoryToDelete?.catagory_name}
        tableName="Catagory"
      />


    </div>

  );

}