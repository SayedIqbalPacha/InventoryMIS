import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import GeneralForm from "@/component/GeneralForm";
import { Button } from "@/components/ui/button";


// --------------------------------------------------
// VALIDATION
// --------------------------------------------------

const createVendorSchema = (t) => z.object({
  vendor_name: z
    .string()
    .trim()
    .min(1, t("pleaseProvideVendorName")),

  email: z
    .string()
    .trim()
    .email(t("pleaseProvideValidEmail"))
    .or(z.literal("")),

  address: z
    .string()
    .trim()
    .optional(),
});


// --------------------------------------------------
// DEFAULT VALUES
// --------------------------------------------------

const defaultValues = {
  vendor_name: "",
  email: "",
  address: "",
};


// --------------------------------------------------
// VENDOR FORM
// --------------------------------------------------

export default function VendorForm({
  vendor,
  onSubmit,
  loading,
}) {
  const { t } = useTranslation();
  const vendorSchema = useMemo(() => createVendorSchema(t), [t]);
  const [serverError, setServerError] = useState("");


  // --------------------------------------------------
  // FORM
  // --------------------------------------------------

  const form = useForm({
    resolver: zodResolver(vendorSchema),
    defaultValues,
  });


  // --------------------------------------------------
  // LOAD EDIT DATA
  // --------------------------------------------------

  useEffect(() => {

    if (vendor) {

      form.reset({
        vendor_name: vendor.vendor_name || "",
        email: vendor.email || "",
        address: vendor.address || "",
      });

    } else {

      form.reset(defaultValues);

    }

    setServerError("");
    form.clearErrors();

  }, [vendor]);


  // --------------------------------------------------
  // FIELDS
  // --------------------------------------------------

  const fields = [

    {
      name: "vendor_name",
      label: t("vendorName"),
      type: "input",
      placeholder: t("enterVendorName"),
      description: t("vendorNameHelp"),
    },

    {
      name: "email",
      label: t("email"),
      type: "input",
      inputType: "email",
      placeholder: t("enterVendorEmail"),
      description: t("vendorEmailHelp"),
    },

    {
      name: "address",
      label: t("address"),
      type: "textarea",
      placeholder: t("enterVendorAddress"),
      description: t("vendorAddressHelp"),
    },

  ];


  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------

  async function handleSubmit(data) {

    try {

      setServerError("");
      form.clearErrors("root.server");

      const vendorData = {
        vendor_name: data.vendor_name.trim(),

        email:
          data.email?.trim() || "",

        address:
          data.address?.trim() || "",
      };

      await onSubmit(vendorData);

    } catch (err) {

      const message =
        err?.message ||
        t("unexpectedError");

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

    if (vendor) {

      form.reset({
        vendor_name: vendor.vendor_name || "",
        email: vendor.email || "",
        address: vendor.address || "",
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
            {t("reset")}
          </Button>

          <Button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading
              ? t("saving")
              : vendor
                ? t("updateVendor")
                : t("addVendor")}
          </Button>

        </div>

      </GeneralForm>

    </div>

  );
}

