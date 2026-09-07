import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import GeneralForm from "@/component/GeneralForm";
import { Button } from "@/components/ui/button";


// --------------------------------------------------
// VALIDATION
// --------------------------------------------------

const purchaseSchema = z.object({
  currency_id: z
    .string()
    .min(1, "Please select a currency."),

  vendor_id: z
    .string()
    .min(1, "Please select a vendor."),

  purchase_date: z
    .string()
    .min(1, "Please provide the purchase date."),

  total_amount: z.preprocess(
    (value) =>
      value === "" || value === undefined
        ? undefined
        : Number(value),
    z
      .number({
        message: "Total amount must be a number.",
      })
      .min(0, "Total amount cannot be negative.")
      .optional()
  ),

  status: z
    .string()
    .trim()
    .optional(),
});


// --------------------------------------------------
// DEFAULT VALUES
// --------------------------------------------------

const defaultValues = {
  currency_id: "",
  vendor_id: "",
  purchase_date: "",
  total_amount: "",
  status: "",
};


// --------------------------------------------------
// PURCHASE FORM
// --------------------------------------------------

export default function PurchaseForm({
  purchase,
  currencies = [],
  vendors = [],
  onSubmit,
  loading,
}) {

  const [serverError, setServerError] = useState("");


  // --------------------------------------------------
  // FORM
  // --------------------------------------------------

  const form = useForm({
    resolver: zodResolver(purchaseSchema),
    defaultValues,
  });


  // --------------------------------------------------
  // LOAD EDIT DATA
  // --------------------------------------------------

  useEffect(() => {

    if (purchase) {

      form.reset({
        currency_id:
          purchase.currency_id != null
            ? String(purchase.currency_id)
            : "",

        vendor_id:
          purchase.vendor_id != null
            ? String(purchase.vendor_id)
            : "",

        purchase_date:
          purchase.purchase_date
            ? String(purchase.purchase_date).slice(0, 10)
            : "",

        total_amount:
          purchase.total_amount ?? "",

        status:
          purchase.status || "",
      });

    } else {

      form.reset(defaultValues);

    }

    setServerError("");
    form.clearErrors();

  }, [purchase]);


  // --------------------------------------------------
  // FIELDS
  // --------------------------------------------------

  const fields = [

    {
      name: "currency_id",
      label: "Currency",
      type: "select",
      placeholder: "Select currency",
      options: currencies.map((currency) => ({
        value: String(currency.currency_id),
        label: currency.currency_code,
      })),
    },

    {
      name: "vendor_id",
      label: "Vendor",
      type: "select",
      placeholder: "Select vendor",
      options: vendors.map((vendor) => ({
        value: String(vendor.vendor_id),
        label: vendor.vendor_name,
      })),
    },

    {
      name: "purchase_date",
      label: "Purchase Date",
      type: "input",
      inputType: "date",
      placeholder: "Select purchase date",
    },

    {
      name: "total_amount",
      label: "Total Amount",
      type: "input",
      inputType: "number",
      placeholder: "Amount of money",
    },

    {
      name: "status",
      label: "Status",
      type: "input",
      placeholder: "Enter purchase status",
      description: "Enter the current purchase status.",
    },

  ];


  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------

  async function handleSubmit(data) {

    try {

      setServerError("");
      form.clearErrors("root.server");

      const purchaseData = {

        currency_id:
          Number(data.currency_id),

        vendor_id:
          Number(data.vendor_id),

        purchase_date:
          data.purchase_date,

        total_amount: data.total_amount === "" || data.total_amount === undefined ? null : Number(data.total_amount),

        status:
          data.status?.trim() || "",
      };

      await onSubmit(purchaseData);

    } catch (err) {

      const message =
        err?.message ||
        "Something went wrong. Please try again.";

      setServerError(message);

      form.setError("root.server", {
        type: "server",
        message,
      });

    }

  }


  // --------------------------------------------------
  // RESET
  // --------------------------------------------------

  function handleReset() {

    if (purchase) {

      form.reset({

        currency_id:
          purchase.currency_id != null
            ? String(purchase.currency_id)
            : "",

        vendor_id:
          purchase.vendor_id != null
            ? String(purchase.vendor_id)
            : "",

        purchase_date:
          purchase.purchase_date
            ? String(purchase.purchase_date).slice(0, 10)
            : "",

        total_amount:
          purchase.total_amount ?? "",

        status:
          purchase.status || "",

      });

    } else {

      form.reset(defaultValues);

    }

    setServerError("");
    form.clearErrors();

  }


  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (

    <div className="space-y-5">

      {/* SERVER ERROR */}

      {(serverError ||
        form.formState.errors.root?.server) && (

        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">

          {serverError ||
            form.formState.errors.root.server.message}

        </div>

      )}


      <GeneralForm
        form={form}
        fields={fields}
        onSubmit={handleSubmit}
      >

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">

          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={handleReset}
            className="w-full sm:w-auto"
          >
            Reset
          </Button>

          <Button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading
              ? "Saving..."
              : purchase
                ? "Update Purchase"
                : "Add Purchase"}
          </Button>

        </div>

      </GeneralForm>

    </div>

  );
}
