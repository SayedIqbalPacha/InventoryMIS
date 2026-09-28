import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import GeneralForm from "@/component/GeneralForm";

import { Button } from "@/components/ui/button";

// --------------------------------------------------
// CURRENCY SCHEMA
// --------------------------------------------------

const createCurrencySchema = (t) => z.object({
  currency_code: z
    .string()
    .trim()
    .min(1, t("currencyCodeRequired"))
    .max(10, t("currencyCodeMaxLength")),
});

// --------------------------------------------------
// DEFAULT VALUES
// --------------------------------------------------

const defaultValues = {
  currency_code: "",
};

// --------------------------------------------------
// CURRENCY FORM
// --------------------------------------------------

export default function CurrencyForm({ currency, onSubmit, loading }) {
  const { t } = useTranslation();
  const currencySchema = useMemo(() => createCurrencySchema(t), [t]);
  const form = useForm({
    resolver: zodResolver(currencySchema),

    defaultValues,

    mode: "onBlur",
  });

  // --------------------------------------------------
  // LOAD CURRENCY WHEN EDITING
  // --------------------------------------------------

  useEffect(() => {
    if (currency) {
      form.reset({
        currency_code: currency.currency_code || "",
      });
    } else {
      form.reset();
    }
  }, [currency, form]);

  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------

  async function handleSubmit(data) {
    try {
      form.clearErrors("root.server");

      await onSubmit(data);
    } catch (error) {
      form.setError("root.server", {
        type: "server",

        message: error.message || t("unexpectedError"),
      });
    }
  }

  // --------------------------------------------------
  // FIELDS
  // --------------------------------------------------

  const fields = [
    {
      name: "currency_code",

      label: t("currencyCode"),

      type: "input",

      placeholder: t("enterCurrencyCode"),
    },
  ];

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="space-y-4">
      {/* SERVER ERROR */}

      {form.formState.errors.root?.server && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {form.formState.errors.root.server.message}
        </div>
      )}

      <GeneralForm
        form={form}

        fields={fields}

        onSubmit={handleSubmit}
      >
        <div className="flex justify-end gap-2 align-bottom">
          <Button
            type="button"

            variant="outline"

            disabled={loading}

            onClick={() => {
              form.reset(defaultValues);

              form.clearErrors();
            }}

            className="w-full sm:w-auto"
          >
            {t("reset")}
          </Button>

          <Button
            type="submit"

            disabled={loading}

            className="w-full sm:w-auto my-2"
          >
            {loading
              ? t("saving")
              : currency
                ? t("updateCurrency")
                : t("addCurrency")}
          </Button>
        </div>
      </GeneralForm>
    </div>
  );
}
