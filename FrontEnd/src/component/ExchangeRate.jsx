import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import GeneralForm from "@/component/GeneralForm";
import { getCurrencyLabel } from "@/lib/getCurrencyLabel";

import { Button } from "@/components/ui/button";

// --------------------------------------------------
// VALIDATION
// --------------------------------------------------

const createExchangeRateSchema = (t) => z.object({
  from_currency_id: z.string().min(1, t("selectSourceCurrencyRequired")),

  to_currency_id: z.string().min(1, t("selectTargetCurrencyRequired")),

  exchange_rate: z.preprocess(
    (value) => (value === "" ? undefined : Number(value)),

    z
      .number({
        message: t("exchangeRateMustBeNumber"),
      })
      .positive(t("exchangeRateMustBePositive")),
  ),

  effective_date: z.string().min(1, t("effectiveDateRequired")),
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
  const { t } = useTranslation();
  const exchangeRateSchema = useMemo(() => createExchangeRateSchema(t), [t]);

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

      label: t("fromCurrency"),

      type: "select",

      placeholder: t("selectSourceCurrency"),

      options: currencies.map((currency) => ({
        value: String(currency.currency_id),

        label: getCurrencyLabel(currency.currency_code, t),
      })),
    },

    {
      name: "to_currency_id",

      label: t("toCurrency"),

      type: "select",

      placeholder: t("selectTargetCurrency"),

      options: currencies.map((currency) => ({
        value: String(currency.currency_id),

        label: getCurrencyLabel(currency.currency_code, t),
      })),
    },

    {
      name: "exchange_rate",

      label: t("exchangeRate"),

      type: "input",

      inputType: "number",

      placeholder: t("enterExchangeRate"),

      description: t("exchangeRateExample"),
    },

    {
      name: "effective_date",

      label: t("effectiveDate"),

      type: "input",

      inputType: "date",

      placeholder: t("selectEffectiveDate"),
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
      const message = err?.message || t("unexpectedError");

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
            {t("reset")}
          </Button>

          <Button
            type="submit"

            disabled={loading}

            className="w-full sm:w-auto"
          >
            {loading
              ? t("saving")
              : exchangeRate
                ? t("updateExchangeRate")
                : t("addExchangeRate")}
          </Button>
        </div>
      </GeneralForm>
    </div>
  );
}
