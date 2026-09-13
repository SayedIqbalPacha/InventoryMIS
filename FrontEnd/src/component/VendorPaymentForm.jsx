import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import GeneralForm from "@/component/GeneralForm";
import { Button } from "@/components/ui/button";

const vendorPaymentSchema = z.object({
  purchase_id: z.string().optional(),

  currency_id: z.string().min(1, "Please select a currency."),

  amount: z
    .string()
    .optional()
    .refine(
      (value) => value === "" || !isNaN(Number(value)),
      "Amount must be a number.",
    ),

  payment_date: z.string().optional(),

  vendor_id: z.string().optional(),
});

const defaultValues = {
  purchase_id: "",
  currency_id: "",
  amount: "",
  payment_date: "",
  vendor_id: "",
};

export default function VendorPaymentForm({
  vendorPayment,
  purchases = [],
  currencies = [],
  vendors = [],
  onSubmit,
  loading,
}) {
  const [serverError, setServerError] = useState("");

  const form = useForm({
    resolver: zodResolver(vendorPaymentSchema),
    defaultValues,
  });

  // --------------------------------------------------
  // RESET FORM WHEN EDITING / CREATING
  // --------------------------------------------------

  useEffect(() => {
    if (vendorPayment) {
      form.reset({
        purchase_id:
          vendorPayment.purchase_id != null
            ? String(vendorPayment.purchase_id)
            : "",

        currency_id:
          vendorPayment.currency_id != null
            ? String(vendorPayment.currency_id)
            : "",

        amount:
          vendorPayment.amount != null ? String(vendorPayment.amount) : "",

        payment_date: vendorPayment.payment_date
          ? String(vendorPayment.payment_date).slice(0, 10)
          : "",

        vendor_id:
          vendorPayment.vendor_id != null
            ? String(vendorPayment.vendor_id)
            : "",
      });
    } else {
      form.reset(defaultValues);
    }

    setServerError("");
    form.clearErrors();
  }, [vendorPayment]);

  // --------------------------------------------------
  // FIELDS
  // --------------------------------------------------

  const fields = [
    {
      name: "purchase_id",
      label: "Purchase",
      type: "select",
      placeholder: "Select purchase (optional)",
      options: purchases.map((purchase) => ({
        value: String(purchase.purchase_id),
        label: `Purchase #${purchase.purchase_id}`,
      })),
    },

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
      name: "amount",
      label: "Amount",
      type: "input",
      inputType: "number",
      placeholder: "Enter amount (optional)",
    },

    {
      name: "payment_date",
      label: "Payment Date",
      type: "input",
      inputType: "date",
      placeholder: "Select payment date (optional)",
    },

    {
      name: "vendor_id",
      label: "Vendor",
      type: "select",
      placeholder: "Select vendor (optional)",
      options: vendors.map((vendor) => ({
        value: String(vendor.vendor_id),
        label: vendor.vendor_name,
      })),
    },
  ];

  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------

  async function handleSubmit(data) {
    try {
      setServerError("");
      form.clearErrors("root.server");

      const vendorPaymentData = {
        purchase_id: data.purchase_id ? Number(data.purchase_id) : null,

        currency_id: Number(data.currency_id),

        amount: data.amount ? Number(data.amount) : null,

        payment_date: data.payment_date || null,

        vendor_id: data.vendor_id ? Number(data.vendor_id) : null,
      };

      await onSubmit(vendorPaymentData);
    } catch (err) {
      const message = err?.message || "Something went wrong. Please try again.";

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
    if (vendorPayment) {
      form.reset({
        purchase_id:
          vendorPayment.purchase_id != null
            ? String(vendorPayment.purchase_id)
            : "",

        currency_id:
          vendorPayment.currency_id != null
            ? String(vendorPayment.currency_id)
            : "",

        amount:
          vendorPayment.amount != null ? String(vendorPayment.amount) : "",

        payment_date: vendorPayment.payment_date
          ? String(vendorPayment.payment_date).slice(0, 10)
          : "",

        vendor_id:
          vendorPayment.vendor_id != null
            ? String(vendorPayment.vendor_id)
            : "",
      });
    } else {
      form.reset(defaultValues);
    }

    setServerError("");
    form.clearErrors();
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="space-y-5">
      {/* SERVER ERROR */}

      {(serverError || form.formState.errors.root?.server) && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {serverError || form.formState.errors.root.server.message}
        </div>
      )}

      <GeneralForm form={form} fields={fields} onSubmit={handleSubmit}>
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

          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading
              ? "Saving..."
              : vendorPayment
                ? "Update Payment"
                : "Add Payment"}
          </Button>
        </div>
      </GeneralForm>
    </div>
  );
}
