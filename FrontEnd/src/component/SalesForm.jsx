import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import GeneralForm from "@/component/GeneralForm";
import { Button } from "@/components/ui/button";


// --------------------------------------------------
// VALIDATION
// --------------------------------------------------

const salesSchema = z.object({
  customer_id: z
    .string()
    .min(1, "Please select a customer."),

  sales_date: z
    .string()
    .min(1, "Please provide the sales date."),

  currency_id: z
    .string()
    .min(1, "Please select a currency."),
});


// --------------------------------------------------
// DEFAULT VALUES
// --------------------------------------------------

const defaultValues = {
  customer_id: "",
  sales_date: "",
  currency_id: "",
};


// --------------------------------------------------
// SALES FORM
// --------------------------------------------------

export default function SalesForm({
  sales,
  customers = [],
  currencies = [],
  onSubmit,
  loading,
}) {

  const [serverError, setServerError] = useState("");


  // --------------------------------------------------
  // FORM
  // --------------------------------------------------

  const form = useForm({
    resolver: zodResolver(salesSchema),
    defaultValues,
  });


  // --------------------------------------------------
  // LOAD EDIT DATA
  // --------------------------------------------------

  useEffect(() => {

    if (sales) {

      form.reset({
        customer_id:
          sales.customer_id != null
            ? String(sales.customer_id)
            : "",

        sales_date:
          sales.sales_date
            ? String(sales.sales_date).slice(0, 10)
            : "",

        currency_id:
          sales.currency_id != null
            ? String(sales.currency_id)
            : "",
      });

    } else {

      form.reset(defaultValues);

    }

    setServerError("");
    form.clearErrors();

  }, [sales]);


  // --------------------------------------------------
  // FIELDS
  // --------------------------------------------------

  const fields = [

    {
      name: "customer_id",
      label: "Customer",
      type: "select",
      placeholder: "Select customer",
      options: customers.map((customer) => ({
        value: String(customer.customer_id),
        label: customer.customer_name,
      })),
    },

    {
      name: "sales_date",
      label: "Sales Date",
      type: "input",
      inputType: "date",
      placeholder: "Select sales date",
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

  ];


  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------

  async function handleSubmit(data) {

    try {

      setServerError("");
      form.clearErrors("root.server");

      const salesData = {
        customer_id: Number(data.customer_id),
        sales_date: data.sales_date,
        currency_id: Number(data.currency_id),
      };

      await onSubmit(salesData);

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

    if (sales) {

      form.reset({
        customer_id:
          sales.customer_id != null
            ? String(sales.customer_id)
            : "",

        sales_date:
          sales.sales_date
            ? String(sales.sales_date).slice(0, 10)
            : "",

        currency_id:
          sales.currency_id != null
            ? String(sales.currency_id)
            : "",
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

        {/* BUTTONS */}

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
              : sales
                ? "Update Sales"
                : "Add Sales"}
          </Button>

        </div>

      </GeneralForm>

    </div>

  );
}

