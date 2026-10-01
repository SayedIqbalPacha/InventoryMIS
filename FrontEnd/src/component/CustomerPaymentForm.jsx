import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import GeneralForm from "@/component/GeneralForm";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { getCurrencyLabel } from "@/lib/getCurrencyLabel";
import { formatLocaleId } from "@/lib/localeFormatters";

const createCustomerPaymentSchema = (t) => z.object({
  customer_id: z.string().optional(),

  currency_id: z.string().min(1, t("selectCurrencyRequired")),

  amount: z
    .string()
    .optional()
    .refine(
      (value) => value === "" || !isNaN(Number(value)),
      t("amountMustBeNumber"),
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
  const { t, i18n } = useTranslation();
  const isDari = (i18n.resolvedLanguage || i18n.language).startsWith("prs");
  const customerPaymentSchema = useMemo(
    () => createCustomerPaymentSchema(t),
    [t],
  );

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
      label: t("customer"),
      type: "select",
      placeholder: t("selectCustomerOptional"),
      options: customers.map((customer) => ({
        value: String(customer.customer_id),
        label: customer.customer_name,
      })),
    },

    {
      name: "currency_id",
      label: t("currency"),
      type: "select",
      placeholder: t("selectCurrency"),
      options: currencies.map((currency) => ({
        value: String(currency.currency_id),
        label: getCurrencyLabel(currency.currency_code, t),
      })),
    },

    {
      name: "amount",
      label: t("amount"),
      type: "input",
      inputType: "number",
      placeholder: t("enterAmountOptional"),
    },

    {
      name: "date",
      label: t("paymentDate"),
      type: "input",
      inputType: "date",
      placeholder: t("selectPaymentDateOptional"),
    },

    {
      name: "sale_id",
      label: t("sale"),
      type: "select",
      placeholder: t("selectSaleOptional"),
      options: sales.map((sale) => ({
        value: String(sale.sales_id),
        label: t("saleNumber", { id: formatLocaleId(sale.sales_id, isDari) }),
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
    } catch {
      const message = t("unexpectedError");

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
            {t("reset")}
          </Button>

          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading
              ? t("saving")
              : customerPayment
                ? t("updatePayment")
                : t("addPayment")}
          </Button>
        </div>
      </GeneralForm>
    </div>
  );
}
