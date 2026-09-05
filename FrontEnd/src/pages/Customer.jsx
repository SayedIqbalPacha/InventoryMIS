
// function CustomerPage(){
//     return(
//         <div>
//             CustomerPage
//         </div>
//     )
// }
// export default CustomerPage;

import { useEffect, useState } from "react";

import {
  getCustomers,
  updateCustomer,
  createCustomer,
  deleteCustomer,
} from "@/services/Customer";

import {useAuth} from "@/contexts/AuthContext";

import CustomerForm from "@/component/CustomerForm";

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
// CUSTOMER PAGE
// --------------------------------------------------

export default function CustomerPage() {

  // DATA

  const [customers, setCustomers] = useState([]);

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

  const [selectedCustomer, setSelectedCustomer] = useState(null);


  // DELETE

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [customerToDelete, setCustomerToDelete] = useState(null);


  // --------------------------------------------------
  // LOAD CUSTOMERS
  // --------------------------------------------------

  async function loadCustomers() {

    try {

      setLoading(true);

      setError("");

      const response =
        await getCustomers();

      setCustomers(
        response.data || []
      );

    } catch (err) {

      setError(
        err.message ||
        "Failed to load customers."
      );

    } finally {

      setLoading(false);

    }

  }


  // --------------------------------------------------
  // INITIAL FETCH
  // --------------------------------------------------

  useEffect(() => {

    loadCustomers();

  }, []);


  // --------------------------------------------------
  // CREATE / UPDATE
  // --------------------------------------------------

  async function handleCustomerSubmit(data) {

    try {

      setFormLoading(true);

      setError("");


      if (selectedCustomer) {

        await updateCustomer(selectedCustomer.customer_id,data);

      } else {

        await createCustomer(data);

      }


      await loadCustomers();


      setFormOpen(false);

      setSelectedCustomer(null);

    }
     catch(err){
      throw err;

    } 
    finally {

      setFormLoading(false);

    }

  }


  // --------------------------------------------------
  // EDIT
  // --------------------------------------------------

  function handleEdit(customer) {

    setSelectedCustomer(customer);

    setFormOpen(true);

  }


  // --------------------------------------------------
  // DELETE DIALOG
  // --------------------------------------------------

  function handleDeleteClick(customer) {

    setCustomerToDelete(customer);

    setDeleteOpen(true);

  }


  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  async function handleDelete() {

    if (!customerToDelete) {
      return;
    }


    try {

      setDeleteLoading(true);

      setError("");


      await deleteCustomer(customerToDelete.customer_id);

      await loadCustomers();


      setDeleteOpen(false);

      setCustomerToDelete(null);

    } catch (err) {

      setError(
        err.message ||
        "Failed to delete customer."
      );

    } finally {

      setDeleteLoading(false);

    }

  }


  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const searchValue =search.toLowerCase().trim();

  const filteredCustomers =
    customers.filter((customer) => {

      return [

        customer.customer_name,

        customer.contact_person,

        customer.phone,

        customer.email,

        customer.address,

      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(searchValue)
        );

    });


  // --------------------------------------------------
  // TABLE COLUMNS
  // --------------------------------------------------

  const columns = [

    {
      key: "customer_name",
      label: "Customer Name",
    },

    {
      key: "contact_person",
      label: "Contact Person",
    },

    {
      key: "phone",
      label: "Phone",
    },

    {
      key: "email",
      label: "Email",
    },

    {
      key: "address",
      label: "Address",
    },

  ];


  // --------------------------------------------------
  // ROLE
  // --------------------------------------------------


  const {user} = useAuth();
  const role = user?.role;

  const canCreate = ["user", "manager", "admin"].includes(role);


  const canUpdate = ["manager", "admin"].includes(role);


  const canDelete = role === "admin";


  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (

    <div className="space-y-6">


      {/* HEADER */}

      <PageHeader
        title="Customers"
        description="Manage your customers"
      >

        {canCreate && (

          <Button
          className="w-full sm:w-auto"
            onClick={() => {

              setSelectedCustomer(null);

              setFormOpen(true);

              setError("");

            }}
          >
            Add Customer
          </Button>

        )}

      </PageHeader>


      {/* SERVER ERROR */}

      {error && (

        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">

          {error}

        </div>

      )}


      {/* SEARCH */}

      <Input
        value={search}
        onChange={(event) =>
          setSearch(event.target.value)
        }
        placeholder="Search customers..."
        className="max-w-sm"
      />


      {/* TABLE */}

      {loading ? (

        <div className="py-10 text-center text-muted-foreground">

          Loading customers...

        </div>

      ) : (

        <GeneralTable

          columns={columns}

          data={filteredCustomers}

          getRowId={(customer) =>
            customer.customer_id
          }


          actions={(customer) => (

            <div className="flex justify-end gap-2">


              {/* UPDATE */}

              {canUpdate && (

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleEdit(customer)
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
                    handleDeleteClick(customer)
                  }
                >
                  Delete
                </Button>

              )}

            </div>

          )}

        />

      )}


      {/* CREATE / UPDATE */}

      <Dialog

        open={formOpen}

        onOpenChange={(open) => {

          setFormOpen(open);

          if (!open) {

            setSelectedCustomer(null);

          }

        }}

      >

        <DialogContent className="sm:max-w-[600px]">

          <DialogHeader>

            <DialogTitle>

              {selectedCustomer
                ? "Edit Customer"
                : "Add Customer"}

            </DialogTitle>


            <DialogDescription>

              {selectedCustomer
                ? "Update customer information."
                : "Enter customer information."}

            </DialogDescription>

          </DialogHeader>


          <CustomerForm

            customer={selectedCustomer}

            onSubmit={handleCustomerSubmit}

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

        name={
          customerToDelete?.customer_name
        }

        tableName="Customer"

      />

    </div>

  );

}