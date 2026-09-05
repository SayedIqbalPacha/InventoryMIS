
// function CustomerPage(){
//     return(
//         <div>
//             CustomerPage
//         </div>
//     )
// }
// export default CustomerPage;
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Eye,
  RefreshCw,
  Loader2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// --------------------------------------------------
// API
// --------------------------------------------------

const API_URL = "http://localhost:9000/api/customers";

// --------------------------------------------------
// ZOD VALIDATION
// --------------------------------------------------

const customerSchema = z.object({
  customer_name: z
    .string()
    .trim()
    .min(2, "Customer name must be at least 2 characters")
    .max(50, "Customer name cannot exceed 50 characters"),

  contact_person: z
    .string()
    .trim()
    .max(50, "Contact person cannot exceed 50 characters"),

  phone: z
    .string()
    .trim()
    .max(20, "Phone cannot exceed 20 characters"),

  email: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || z.string().email().safeParse(value).success,
      "Please provide a valid email address",
    )
    .max(200, "Email cannot exceed 200 characters"),

  address: z
    .string()
    .trim()
    .max(200, "Address cannot exceed 200 characters"),
});

// --------------------------------------------------
// DEFAULT VALUES
// --------------------------------------------------

const defaultValues = {
  customer_name: "",
  contact_person: "",
  phone: "",
  email: "",
  address: "",
};

// --------------------------------------------------
// COMPONENT
// --------------------------------------------------

export default function CustomerPage() {
  // ------------------------------------------------
  // STATE
  // ------------------------------------------------

  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const [serverError, setServerError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [editingCustomerId, setEditingCustomerId] = useState(null);

  const [viewingCustomer, setViewingCustomer] = useState(null);

  const [viewLoading, setViewLoading] = useState(false);

  const [deleteCustomerId, setDeleteCustomerId] = useState(null);

  const [formOpen, setFormOpen] = useState(false);

  // ------------------------------------------------
  // FORM
  // ------------------------------------------------

  const form = useForm({
    resolver: zodResolver(customerSchema),

    defaultValues,

    mode: "onBlur",
  });

  // ------------------------------------------------
  // TOKEN
  // ------------------------------------------------

  function getToken() {
    return localStorage.getItem("token");
  }

  // ------------------------------------------------
  // COMMON HEADERS
  // ------------------------------------------------

  function getHeaders(withBody = false) {
    const token = getToken();

    return {
      ...(withBody && {
        "Content-Type": "application/json",
      }),

      Authorization: `Bearer ${token}`,
    };
  }

  // ------------------------------------------------
  // GET ERROR MESSAGE
  // ------------------------------------------------

  async function getErrorMessage(response) {
    try {
      const result = await response.json();

      return result.message || "Something went wrong";
    } catch {
      return "Something went wrong";
    }
  }

  // ------------------------------------------------
  // GET ALL CUSTOMERS
  // ------------------------------------------------

  async function getCustomers() {
    try {
      setLoading(true);
      setServerError("");

      const response = await fetch(API_URL, {
        method: "GET",
        headers: getHeaders(),
      });

      if (!response.ok) {
        const message = await getErrorMessage(response);

        throw new Error(message);
      }

      const result = await response.json();

      setCustomers(result.data);
    } catch (error) {
      setServerError(
        error.message || "Failed to load customers",
      );
    } finally {
      setLoading(false);
    }
  }

  // ------------------------------------------------
  // GET CUSTOMERS ON PAGE LOAD
  // ------------------------------------------------

  useEffect(() => {
    getCustomers();
  }, []);

  // ------------------------------------------------
  // FILTER CUSTOMERS
  // ------------------------------------------------

  const filteredCustomers = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) {
      return customers;
    }

    return customers.filter((customer) =>
      [
        customer.customer_name,
        customer.contact_person,
        customer.phone,
        customer.email,
        customer.address,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(search),
        ),
    );
  }, [customers, searchTerm]);

  // ------------------------------------------------
  // OPEN CREATE FORM
  // ------------------------------------------------

  function handleOpenCreate() {
    setEditingCustomerId(null);

    form.reset(defaultValues);

    form.clearErrors();

    setServerError("");

    setFormOpen(true);
  }

  // ------------------------------------------------
  // GET ONE CUSTOMER
  // ------------------------------------------------

  async function getCustomer(customerId) {
    try {
      setViewLoading(true);
      setServerError("");

      const response = await fetch(
        `${API_URL}/${customerId}`,
        {
          method: "GET",
          headers: getHeaders(),
        },
      );

      if (!response.ok) {
        const message = await getErrorMessage(response);

        throw new Error(message);
      }

      const result = await response.json();

      return result.data;
    } catch (error) {
      setServerError(
        error.message || "Failed to load customer",
      );

      return null;
    } finally {
      setViewLoading(false);
    }
  }

  // ------------------------------------------------
  // OPEN VIEW
  // ------------------------------------------------

  async function handleView(customerId) {
    const customer = await getCustomer(customerId);

    if (!customer) {
      return;
    }

    setViewingCustomer(customer);
  }

  // ------------------------------------------------
  // OPEN EDIT
  // ------------------------------------------------

  async function handleEdit(customerId) {
    const customer = await getCustomer(customerId);

    if (!customer) {
      return;
    }

    setEditingCustomerId(customer.customer_id);

    form.reset({
      customer_name: customer.customer_name || "",
      contact_person: customer.contact_person || "",
      phone: customer.phone || "",
      email: customer.email || "",
      address: customer.address || "",
    });

    form.clearErrors();

    setServerError("");

    setFormOpen(true);
  }

  // ------------------------------------------------
  // CREATE / UPDATE
  // ------------------------------------------------

  async function onSubmit(data) {
    try {
      setSubmitting(true);
      setServerError("");

      form.clearErrors();

      // --------------------------------------------
      // UPDATE
      // --------------------------------------------

      if (editingCustomerId) {
        const response = await fetch(
          `${API_URL}/${editingCustomerId}`,
          {
            method: "PATCH",

            headers: getHeaders(true),

            body: JSON.stringify(data),
          },
        );

        if (!response.ok) {
          const message = await getErrorMessage(response);

          // Your current backend returns only:
          // { status, message }
          //
          // So we show it as a general server error.

          setServerError(message);

          return;
        }

        // Your backend returns:
        //
        // {
        //   status: "success",
        //   message: "Customer updated successfully"
        // }

        setFormOpen(false);

        setEditingCustomerId(null);

        form.reset(defaultValues);

        await getCustomers();

        return;
      }

      // --------------------------------------------
      // CREATE
      // --------------------------------------------

      const response = await fetch(API_URL, {
        method: "POST",

        headers: getHeaders(true),

        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const message = await getErrorMessage(response);

        setServerError(message);

        return;
      }

      // Create response:
      //
      // {
      //   status: "success",
      //   insertedId: ...
      // }

      setFormOpen(false);

      form.reset(defaultValues);

      await getCustomers();
    } catch (error) {
      setServerError(
        error.message || "Unable to connect to the server",
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ------------------------------------------------
  // DELETE
  // ------------------------------------------------

  async function handleDelete() {
    if (!deleteCustomerId) {
      return;
    }

    try {
      setDeleting(true);
      setServerError("");

      const response = await fetch(
        `${API_URL}/${deleteCustomerId}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        },
      );

      // IMPORTANT:
      //
      // Your backend returns HTTP 204.
      //
      // 204 means there is NO response body.
      //
      // Therefore DO NOT call:
      // await response.json()

      if (!response.ok) {
        const message = await getErrorMessage(response);

        setServerError(message);

        return;
      }

      setDeleteCustomerId(null);

      await getCustomers();
    } catch (error) {
      setServerError(
        error.message || "Failed to delete customer",
      );
    } finally {
      setDeleting(false);
    }
  }

  // ------------------------------------------------
  // CANCEL FORM
  // ------------------------------------------------

  function handleCancelForm() {
    setFormOpen(false);

    setEditingCustomerId(null);

    form.reset(defaultValues);

    form.clearErrors();

    setServerError("");
  }

  // ------------------------------------------------
  // RENDER
  // ------------------------------------------------

  return (
    <div className="space-y-6 p-6">

      {/* ========================================== */}
      {/* PAGE HEADER */}
      {/* ========================================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Customers
          </h1>

          <p className="text-muted-foreground">
            Manage your customers and their contact
            information.
          </p>
        </div>

        <Button onClick={handleOpenCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>

      </div>

      {/* ========================================== */}
      {/* GENERAL SERVER ERROR */}
      {/* ========================================== */}

      {serverError && (
        <div className="flex items-start justify-between rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">

          <div>
            <p className="font-medium">
              Server Error
            </p>

            <p className="mt-1">
              {serverError}
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setServerError("")}
          >
            <X className="h-4 w-4" />
          </Button>

        </div>
      )}

      {/* ========================================== */}
      {/* CUSTOMER TABLE CARD */}
      {/* ========================================== */}

      <Card>

        <CardHeader>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>
              <CardTitle>
                Customer List
              </CardTitle>

              <CardDescription>
                {customers.length} customer
                {customers.length !== 1 && "s"}
                {" "}found
              </CardDescription>
            </div>

            <div className="flex gap-2">

              {/* SEARCH */}

              <div className="relative w-full md:w-72">

                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                  placeholder="Search customers..."
                  className="pl-9"
                />

              </div>

              {/* REFRESH */}

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={getCustomers}
                disabled={loading}
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    loading ? "animate-spin" : ""
                  }`}
                />
              </Button>

            </div>

          </div>

        </CardHeader>

        <CardContent>

          {loading ? (
            /* -------------------------------------- */
            /* LOADING */
            /* -------------------------------------- */

            <div className="flex min-h-48 items-center justify-center">

              <Loader2 className="h-6 w-6 animate-spin" />

            </div>
          ) : filteredCustomers.length === 0 ? (
            /* -------------------------------------- */
            /* EMPTY */
            /* -------------------------------------- */

            <div className="flex min-h-48 flex-col items-center justify-center text-center">

              <p className="font-medium">
                No customers found
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {searchTerm
                  ? "Try a different search."
                  : "Add your first customer to get started."}
              </p>

              {!searchTerm && (
                <Button
                  className="mt-4"
                  onClick={handleOpenCreate}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Customer
                </Button>
              )}

            </div>
          ) : (
            /* -------------------------------------- */
            /* TABLE */
            /* -------------------------------------- */

            <div className="overflow-x-auto">

              <Table>

                <TableHeader>

                  <TableRow>

                    <TableHead>
                      ID
                    </TableHead>

                    <TableHead>
                      Customer Name
                    </TableHead>

                    <TableHead>
                      Contact Person
                    </TableHead>

                    <TableHead>
                      Phone
                    </TableHead>

                    <TableHead>
                      Email
                    </TableHead>

                    <TableHead>
                      Address
                    </TableHead>

                    <TableHead className="text-right">
                      Actions
                    </TableHead>

                  </TableRow>

                </TableHeader>

                <TableBody>

                  {filteredCustomers.map((customer) => (
                    <TableRow
                      key={customer.customer_id}
                    >

                      <TableCell>
                        {customer.customer_id}
                      </TableCell>

                      <TableCell className="font-medium">
                        {customer.customer_name}
                      </TableCell>

                      <TableCell>
                        {customer.contact_person || "—"}
                      </TableCell>

                      <TableCell>
                        {customer.phone || "—"}
                      </TableCell>

                      <TableCell>
                        {customer.email || "—"}
                      </TableCell>

                      <TableCell className="max-w-52 truncate">
                        {customer.address || "—"}
                      </TableCell>

                      <TableCell>

                        <div className="flex justify-end gap-1">

                          {/* VIEW */}

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            title="View customer"
                            onClick={() =>
                              handleView(
                                customer.customer_id,
                              )
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          {/* EDIT */}

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            title="Edit customer"
                            onClick={() =>
                              handleEdit(
                                customer.customer_id,
                              )
                            }
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          {/* DELETE */}

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            title="Delete customer"
                            className="text-destructive hover:text-destructive"
                            onClick={() =>
                              setDeleteCustomerId(
                                customer.customer_id,
                              )
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>

                        </div>

                      </TableCell>

                    </TableRow>
                  ))}

                </TableBody>

              </Table>

            </div>
          )}

        </CardContent>

      </Card>

      {/* ========================================== */}
      {/* CREATE / UPDATE DIALOG */}
      {/* ========================================== */}

      <Dialog
        open={formOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleCancelForm();
          }
        }}
      >

        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">

          <DialogHeader>

            <DialogTitle>
              {editingCustomerId
                ? "Update Customer"
                : "Add Customer"}
            </DialogTitle>

            <DialogDescription>
              {editingCustomerId
                ? "Update the customer's information below."
                : "Enter the customer's information below."}
            </DialogDescription>

          </DialogHeader>

          {/* ====================================== */}
          {/* FORM */}
          {/* ====================================== */}

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
          >
            <FieldGroup>

              {/* CUSTOMER NAME */}

              <Field data-invalid={!!form.formState.errors.customer_name}>

                <FieldLabel htmlFor="customer_name">
                  Customer Name
                </FieldLabel>

                <Input
                  id="customer_name"
                  placeholder="Enter customer name"
                  autoComplete="organization"
                  {...form.register("customer_name")}
                  aria-invalid={
                    !!form.formState.errors.customer_name
                  }
                />

                <FieldDescription>
                  This is the customer's main name.
                </FieldDescription>

                {form.formState.errors.customer_name && (
                  <FieldError>
                    {
                      form.formState.errors.customer_name
                        .message
                    }
                  </FieldError>
                )}

              </Field>

              {/* CONTACT PERSON */}

              <Field
                data-invalid={
                  !!form.formState.errors.contact_person
                }
              >

                <FieldLabel htmlFor="contact_person">
                  Contact Person
                </FieldLabel>

                <Input
                  id="contact_person"
                  placeholder="Enter contact person"
                  autoComplete="name"
                  {...form.register("contact_person")}
                  aria-invalid={
                    !!form.formState.errors.contact_person
                  }
                />

                <FieldDescription>
                  Optional person to contact for this
                  customer.
                </FieldDescription>

                {form.formState.errors.contact_person && (
                  <FieldError>
                    {
                      form.formState.errors.contact_person
                        .message
                    }
                  </FieldError>
                )}

              </Field>

              {/* PHONE */}

              <Field
                data-invalid={
                  !!form.formState.errors.phone
                }
              >

                <FieldLabel htmlFor="phone">
                  Phone
                </FieldLabel>

                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  autoComplete="tel"
                  {...form.register("phone")}
                  aria-invalid={
                    !!form.formState.errors.phone
                  }
                />

                <FieldDescription>
                  Optional phone number.
                </FieldDescription>

                {form.formState.errors.phone && (
                  <FieldError>
                    {
                      form.formState.errors.phone.message
                    }
                  </FieldError>
                )}

              </Field>

              {/* EMAIL */}

              <Field
                data-invalid={
                  !!form.formState.errors.email
                }
              >

                <FieldLabel htmlFor="email">
                  Email
                </FieldLabel>

                <Input
                  id="email"
                  type="email"
                  placeholder="customer@example.com"
                  autoComplete="email"
                  {...form.register("email")}
                  aria-invalid={
                    !!form.formState.errors.email
                  }
                />

                <FieldDescription>
                  Optional email address.
                </FieldDescription>

                {form.formState.errors.email && (
                  <FieldError>
                    {
                      form.formState.errors.email.message
                    }
                  </FieldError>
                )}

              </Field>

              {/* ADDRESS */}

              <Field
                data-invalid={
                  !!form.formState.errors.address
                }
              >

                <FieldLabel htmlFor="address">
                  Address
                </FieldLabel>

                <Textarea
                  id="address"
                  placeholder="Enter customer address"
                  rows={4}
                  {...form.register("address")}
                  aria-invalid={
                    !!form.formState.errors.address
                  }
                />

                <FieldDescription>
                  Optional customer address.
                </FieldDescription>

                {form.formState.errors.address && (
                  <FieldError>
                    {
                      form.formState.errors.address.message
                    }
                  </FieldError>
                )}

              </Field>

              {/* ================================= */}
              {/* FORM SERVER ERROR */}
              {/* ================================= */}

              {serverError && (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  {serverError}
                </div>
              )}

              {/* ================================= */}
              {/* BUTTONS */}
              {/* ================================= */}

              <div className="flex justify-end gap-2">

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelForm}
                  disabled={submitting}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={submitting}
                >

                  {submitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}

                  {submitting
                    ? "Saving..."
                    : editingCustomerId
                    ? "Update Customer"
                    : "Add Customer"}

                </Button>

              </div>

            </FieldGroup>
          </form>

        </DialogContent>

      </Dialog>

      {/* ========================================== */}
      {/* VIEW CUSTOMER DIALOG */}
      {/* ========================================== */}

      <Dialog
        open={!!viewingCustomer}
        onOpenChange={(open) => {
          if (!open) {
            setViewingCustomer(null);
          }
        }}
      >

        <DialogContent className="sm:max-w-lg">

          <DialogHeader>

            <DialogTitle>
              Customer Details
            </DialogTitle>

            <DialogDescription>
              Complete information about this customer.
            </DialogDescription>

          </DialogHeader>

          {viewLoading ? (
            <div className="flex min-h-32 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : viewingCustomer ? (
            <div className="space-y-4">

              <div>
                <p className="text-sm text-muted-foreground">
                  Customer ID
                </p>

                <p className="font-medium">
                  {viewingCustomer.customer_id}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Customer Name
                </p>

                <p className="font-medium">
                  {viewingCustomer.customer_name}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Contact Person
                </p>

                <p>
                  {viewingCustomer.contact_person ||
                    "—"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Phone
                </p>

                <p>
                  {viewingCustomer.phone || "—"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Email
                </p>

                <p>
                  {viewingCustomer.email || "—"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Address
                </p>

                <p>
                  {viewingCustomer.address || "—"}
                </p>
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={() => {
                    setViewingCustomer(null);

                    handleEdit(
                      viewingCustomer.customer_id,
                    );
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Customer
                </Button>
              </div>

            </div>
          ) : null}

        </DialogContent>

      </Dialog>

      {/* ========================================== */}
      {/* DELETE CONFIRMATION */}
      {/* ========================================== */}

      <AlertDialog
        open={!!deleteCustomerId}
        onOpenChange={(open) => {
          if (!open && !deleting) {
            setDeleteCustomerId(null);
          }
        }}
      >

        <AlertDialogContent>

          <AlertDialogHeader>

            <AlertDialogTitle>
              Delete customer?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone. The customer
              will be permanently removed from the
              database.
            </AlertDialogDescription>

          </AlertDialogHeader>

          <AlertDialogFooter>

            <AlertDialogCancel disabled={deleting}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >

              {deleting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}

              {deleting
                ? "Deleting..."
                : "Delete Customer"}

            </AlertDialogAction>

          </AlertDialogFooter>

        </AlertDialogContent>

      </AlertDialog>

    </div>
  );
}