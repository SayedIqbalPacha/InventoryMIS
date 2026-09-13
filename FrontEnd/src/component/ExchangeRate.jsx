import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import GeneralForm from "@/component/GeneralForm";

import { Button } from "@/components/ui/button";

// --------------------------------------------------
// VALIDATION
// --------------------------------------------------

const exchangeRateSchema = z.object({
  from_currency_id: z.string().min(1, "Please select the source currency."),

  to_currency_id: z.string().min(1, "Please select the target currency."),

  exchange_rate: z.preprocess(
    (value) => (value === "" ? undefined : Number(value)),

    z
      .number({
        message: "Exchange rate must be a number.",
      })
      .positive("Exchange rate must be greater than 0."),
  ),

  effective_date: z.string().min(1, "Please provide the effective date."),
});

// --------------------------------------------------
// DEFAULT VALUES
// --------------------------------------------------

const defaultValues = {
  from_currency_id: "",

  to_currency_id: "",

  exchange_rate: "",

  effective_date: "",
};

// --------------------------------------------------
// EXCHANGE RATE FORM
// --------------------------------------------------

export default function ExchangeRateForm({
  exchangeRate,

  currencies = [],

  onSubmit,

  loading,
}) {
  const [serverError, setServerError] = useState("");

  // --------------------------------------------------
  // FORM
  // --------------------------------------------------

  const form = useForm({
    resolver: zodResolver(exchangeRateSchema),

    defaultValues,
  });

  // --------------------------------------------------
  // LOAD EDIT DATA
  // --------------------------------------------------

  useEffect(() => {
    if (exchangeRate) {
      form.reset({
        from_currency_id:
          exchangeRate.from_currency_id != null
            ? String(exchangeRate.from_currency_id)
            : "",

        to_currency_id:
          exchangeRate.to_currency_id != null
            ? String(exchangeRate.to_currency_id)
            : "",

        exchange_rate:
          exchangeRate.exchange_rate != null
            ? String(exchangeRate.exchange_rate)
            : "",

        effective_date: exchangeRate.effective_date
          ? String(exchangeRate.effective_date).slice(0, 10)
          : "",
      });
    } else {
      form.reset(defaultValues);
    }

    setServerError("");

    form.clearErrors();
  }, [exchangeRate, form]);

  // --------------------------------------------------
  // FIELDS
  // --------------------------------------------------

  const fields = [
    {
      name: "from_currency_id",

      label: "From Currency",

      type: "select",

      placeholder: "Select source currency",

      options: currencies.map((currency) => ({
        value: String(currency.currency_id),

        label: currency.currency_code,
      })),
    },

    {
      name: "to_currency_id",

      label: "To Currency",

      type: "select",

      placeholder: "Select target currency",

      options: currencies.map((currency) => ({
        value: String(currency.currency_id),

        label: currency.currency_code,
      })),
    },

    {
      name: "exchange_rate",

      label: "Exchange Rate",

      type: "input",

      inputType: "number",

      placeholder: "Enter exchange rate",

      description: "Example: 1 USD = 64 AFG",
    },

    {
      name: "effective_date",

      label: "Effective Date",

      type: "input",

      inputType: "date",

      placeholder: "Select effective date",
    },
  ];

  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------

  async function handleSubmit(data) {
    try {
      setServerError("");

      form.clearErrors("root.server");

      const exchangeRateData = {
        from_currency_id: Number(data.from_currency_id),

        to_currency_id: Number(data.to_currency_id),

        exchange_rate: Number(data.exchange_rate),

        effective_date: data.effective_date,
      };

      await onSubmit(exchangeRateData);
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
    if (exchangeRate) {
      form.reset({
        from_currency_id:
          exchangeRate.from_currency_id != null
            ? String(exchangeRate.from_currency_id)
            : "",

        to_currency_id:
          exchangeRate.to_currency_id != null
            ? String(exchangeRate.to_currency_id)
            : "",

        exchange_rate:
          exchangeRate.exchange_rate != null
            ? String(exchangeRate.exchange_rate)
            : "",

        effective_date: exchangeRate.effective_date
          ? String(exchangeRate.effective_date).slice(0, 10)
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

      {(serverError || form.formState.errors.root?.server) && (
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
          {serverError || form.formState.errors.root.server.message}
        </div>
      )}

      <GeneralForm
        form={form}

        fields={fields}

        onSubmit={handleSubmit}
      >
        {/* BUTTONS */}

        <div
          className="
            flex
            flex-col
            gap-3
            pt-2
            sm:flex-row
            sm:justify-end
          "
        >
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
              : exchangeRate
                ? "Update Exchange Rate"
                : "Add Exchange Rate"}
          </Button>
        </div>
      </GeneralForm>
    </div>
  );
}
