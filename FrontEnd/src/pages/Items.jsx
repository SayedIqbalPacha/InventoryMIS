import { useEffect, useState } from "react";

import {
  getItems,
  updateItem,
  createItem,
  deleteItem,
} from "@/services/Items";

import { getCatagories } from "@/services/Catagory";
import { getUnits } from "@/services/Units";

import { useAuth } from "@/contexts/AuthContext";

import ItemForm from "@/component/ItemForm";
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
// ITEMS PAGE
// --------------------------------------------------

export default function ItemsPage() {

  // --------------------------------------------------
  // DATA
  // --------------------------------------------------

  const [items, setItems] = useState([]);
  const [units, setUnits] = useState([]);
  const [catagories, setCatagories] = useState([]);


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
  const [selectedItem, setSelectedItem] = useState(null);


  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);


  // --------------------------------------------------
  // LOAD ALL DATA
  // --------------------------------------------------

  async function loadData() {

    try {

      setLoading(true);
      setError("");

      const [itemsResponse,catagoriesResponse,unitsResponse,] =
       await Promise.all([
        getItems(),
        getCatagories(),
        getUnits(),
      ]);


      setItems(
        itemsResponse?.data || []
      );

      setCatagories(
        catagoriesResponse?.data || []
      );

      setUnits(
        unitsResponse?.data || []
      );

    } catch (err) {

      setError(
        err.message ||
        "Failed to load items."
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

  async function handleItemSubmit(data) {

    try {

      setFormLoading(true);
      setError("");

      if (selectedItem) {

        await updateItem(
          selectedItem.item_id,
          data
        );

      } else {

        await createItem(data);

      }


      await loadData();


      setFormOpen(false);
      setSelectedItem(null);

    } catch (err) {

      throw err;

    } finally {

      setFormLoading(false);

    }

  }


  // --------------------------------------------------
  // EDIT
  // --------------------------------------------------

  function handleEdit(item) {

    setSelectedItem(item);
    setFormOpen(true);

  }


  // --------------------------------------------------
  // DELETE DIALOG
  // --------------------------------------------------

  function handleDeleteClick(item) {

    setItemToDelete(item);
    setDeleteOpen(true);

  }


  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  async function handleDelete() {

    if (!itemToDelete) {
      return;
    }


    try {

      setDeleteLoading(true);
      setError("");


      await deleteItem(
        itemToDelete.item_id
      );


      await loadData();


      setDeleteOpen(false);
      setItemToDelete(null);

    } catch (err) {

      setError(
        err.message ||
        "Failed to delete item."
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


  // --------------------------------------------------
  // MAP LOOKUPS
  // --------------------------------------------------

  // this function is javascript Object.fromEntries() change the array to object to display the names, but they are ids in fact
  const unitMap = Object.fromEntries(
    units.map((unit) => [
      unit.unit_id,
      unit.unit_name,
    ])
  );


  const catagoryMap = Object.fromEntries(
    catagories.map((catagory) => [
      catagory.catagory_id,
      catagory.catagory_name,
    ])
  );


  // --------------------------------------------------
  // PREPARE TABLE DATA
  // --------------------------------------------------

  const tableItems = items.map((item) => ({

    ...item,
    unit_name_display:unitMap[item.unit_id] || "-",
    catagory_name_display:catagoryMap[item.catagory_id] || "-",

  }));


  // --------------------------------------------------
  // FILTER
  // --------------------------------------------------

  const filteredItems =tableItems.filter((item) => {

      return (

        String(
          item.item_name || ""
        )
          .toLowerCase()
          .includes(searchValue)

        ||

        String(
          item.description || ""
        )
          .toLowerCase()
          .includes(searchValue)

        ||

        String(
          item.unit_name_display || ""
        )
          .toLowerCase()
          .includes(searchValue)

        ||

        String(
          item.catagory_name_display || ""
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
      key: "item_id",
      label: "ID",
    },

    {
      key: "item_name",
      label: "Item Name",
    },

    {
      key: "description",
      label: "Description",
    },

    {
      key: "sell_price",
      label: "Sell Price",
    },

    {
      key: "cost_price",
      label: "Cost Price",
    },

    {
      key: "stock_quantity",
      label: "Stock",
    },

    {
      key: "unit_name_display",
      label: "Unit",
    },

    {
      key: "catagory_name_display",
      label: "Catagory",
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
        title="Items"
        description="Manage your inventory items"
      >

        {canCreate && (

          <Button
            className="w-full sm:w-auto"
            onClick={() => {

              setSelectedItem(null);
              setFormOpen(true);
              setError("");

            }}
          >
            Add Item
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
          placeholder="Search items..."
        />

      </div>


      {/* TABLE */}

      {loading ? (

        <div className="py-10 text-center text-muted-foreground">
          Loading items...
        </div>

      ) : (

        <div className="w-full overflow-x-auto">

          <GeneralTable
            columns={columns}
            data={filteredItems}
            getRowId={(item) =>
              item.item_id
            }
            actions={(item) => (

              <div className="flex flex-wrap justify-end gap-2">

                {/* EDIT */}

                {canUpdate && (

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleEdit(item)
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
                      handleDeleteClick(item)
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
            setSelectedItem(null);
          }

        }}
      >

        <DialogContent className="w-[calc(100%-2rem)] max-w-[750px] sm:w-full">

          <DialogHeader>

            <DialogTitle>

              {selectedItem
                ? "Edit Item"
                : "Add Item"}

            </DialogTitle>


            <DialogDescription>

              {selectedItem
                ? "Update item information."
                : "Enter item information."}

            </DialogDescription>

          </DialogHeader>


          <ItemForm
            item={selectedItem}
            units={units}
            catagories={catagories}
            onSubmit={handleItemSubmit}
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
        name={itemToDelete?.item_name}
        tableName="Item"
      />

    </div>

  );
}
