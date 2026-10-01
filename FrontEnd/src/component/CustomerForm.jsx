import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { translateApiError } from "@/lib/translateApiError";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import GeneralForm from "@/component/GeneralForm";

import { Button } from "@/components/ui/button";

const createCustomerSchema = (t) => z.object({
  customer_name: z.string().trim().min(2, t("customerNameMin")).max(50, t("customerNameMax")),
  contact_person: z.string().trim().max(50, t("contactPersonMax")),
  phone: z.string().trim().regex(/^[0-9+\-\s()]+$/, t("validPhone")).min(7, t("phoneTooShort")).max(20, t("phoneTooLong")),
  email: z.string().trim().email(t("validEmail")).max(200, t("emailTooLong")),
  address: z.string().trim().max(200, t("addressTooLong")),
});

const defaultValues = {
  customer_name: "",

  contact_person: "",

  phone: "",

  email: "",

  address: "",
};

export default function CustomerForm({ customer, onSubmit, loading }) {
  const { t } = useTranslation();
  const customerSchema = useMemo(() => createCustomerSchema(t), [t]);
  const form = useForm({
    resolver: zodResolver(customerSchema),

    defaultValues,

    mode: "onBlur",
  });

  // LOAD CUSTOMER WHEN EDITING

  useEffect(() => {
    if (customer) {
      form.reset({
        customer_name: customer.customer_name || "",

        contact_person: customer.contact_person || "",

        phone: customer.phone || "",

        email: customer.email || "",

        address: customer.address || "",
      });
    } else {
      form.reset();
    }
  }, [customer, form]);

  // SUBMIT

  async function handleSubmit(data) {
    try {
      form.clearErrors("root.server");

      await onSubmit(data);
    } catch (error) {
      form.setError("root.server", {
        type: "server",

        message: translateApiError(error, t, "unexpectedError"),
      });
    }
  }

  const fields = [
    {
      name: "customer_name",
      label: t("customerName"),
      type: "input",
      placeholder: t("enterCustomerName"),
    },

    {
      name: "contact_person",
      label: t("contactPerson"),
      type: "input",
      placeholder: t("enterContactPerson"),
    },

    {
      name: "phone",
      label: t("phone"),
      type: "input",
      inputType: "tel",
      placeholder: t("enterPhoneNumber"),
    },

    {
      name: "email",
      label: t("email"),
      type: "input",
      inputType: "email",
      placeholder: t("enterEmailAddress"),
    },

    {
      name: "address",
      label: t("address"),
      type: "textarea",
      placeholder: t("enterCustomerAddress"),
    },
  ];

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
        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => {
              form.reset(defaultValues);

              form.clearErrors();
            }}
          >
            {t("reset")}
          </Button>

          <Button type="submit" disabled={loading}>
            {loading
              ? t("saving")
              : customer
                ? t("updateCustomer")
                : t("addCustomer")}
          </Button>
        </div>
      </GeneralForm>
    </div>
  );
}
