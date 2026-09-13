import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import GeneralForm from "@/component/GeneralForm";
import { Button } from "@/components/ui/button";

const customerPaymentSchema = z.object({
  customer_id: z.string().optional(),

  currency_id: z.string().min(1, "Please select a currency."),

  amount: z
    .string()
    .optional()
    .refine(
      (value) => value === "" || !isNaN(Number(value)),
      "Amount must be a number.",
    ),

  date: z.string().optional(),

  sale_id: z.string().optional(),
});

const defaultValues = {
  customer_id: "",
  currency_id: "",
  amount: "",
  date: "",
  sale_id: "",
};

export default function CustomerPaymentForm({
  customerPayment,
  customers = [],
  currencies = [],
  sales = [],
  onSubmit,
  loading,
}) {
  const [serverError, setServerError] = useState("");

  const form = useForm({
    resolver: zodResolver(customerPaymentSchema),
    defaultValues,
  });

  useEffect(() => {
    if (customerPayment) {
      form.reset({
        customer_id:
          customerPayment.customer_id != null
            ? String(customerPayment.customer_id)
            : "",

        currency_id:
          customerPayment.currency_id != null
            ? String(customerPayment.currency_id)
            : "",

        amount:
          customerPayment.amount != null ? String(customerPayment.amount) : "",

        date: customerPayment.date
          ? String(customerPayment.date).slice(0, 10)
          : "",

        sale_id:
          customerPayment.sale_id != null
            ? String(customerPayment.sale_id)
            : "",
      });
    } else {
      form.reset(defaultValues);
    }

    setServerError("");
    form.clearErrors();
  }, [customerPayment]);

  const fields = [
    {
      name: "customer_id",
      label: "Customer",
      type: "select",
      placeholder: "Select customer (optional)",
      options: customers.map((customer) => ({
        value: String(customer.customer_id),
        label: customer.customer_name,
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
      name: "date",
      label: "Payment Date",
      type: "input",
      inputType: "date",
      placeholder: "Select payment date (optional)",
    },

    {
      name: "sale_id",
      label: "Sale",
      type: "select",
      placeholder: "Select sale (optional)",
      options: sales.map((sale) => ({
        value: String(sale.sales_id),
        label: `Sale #${sale.sales_id}`,
      })),
    },
  ];

  async function handleSubmit(data) {
    try {
      setServerError("");
      form.clearErrors("root.server");

      const customerPaymentData = {
        customer_id: data.customer_id ? Number(data.customer_id) : null,

        currency_id: Number(data.currency_id),

        amount: data.amount ? Number(data.amount) : null,

        date: data.date || null,

        sale_id: data.sale_id ? Number(data.sale_id) : null,
      };

      await onSubmit(customerPaymentData);
    } catch (err) {
      const message = err?.message || "Something went wrong. Please try again.";

      setServerError(message);

      form.setError("root.server", {
        type: "server",
        message,
      });
    }
  }

  function handleReset() {
    if (customerPayment) {
      form.reset({
        customer_id:
          customerPayment.customer_id != null
            ? String(customerPayment.customer_id)
            : "",

        currency_id:
          customerPayment.currency_id != null
            ? String(customerPayment.currency_id)
            : "",

        amount:
          customerPayment.amount != null ? String(customerPayment.amount) : "",

        date: customerPayment.date
          ? String(customerPayment.date).slice(0, 10)
          : "",

        sale_id:
          customerPayment.sale_id != null
            ? String(customerPayment.sale_id)
            : "",
      });
    } else {
      form.reset(defaultValues);
    }

    setServerError("");
    form.clearErrors();
  }

  return (
    <div className="space-y-5">
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
              : customerPayment
                ? "Update Payment"
                : "Add Payment"}
          </Button>
        </div>
      </GeneralForm>
    </div>
  );
}
