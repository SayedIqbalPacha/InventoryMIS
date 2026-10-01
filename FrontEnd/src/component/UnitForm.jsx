import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { translateApiError } from "@/lib/translateApiError";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import GeneralForm from "@/component/GeneralForm";
import { Button } from "@/components/ui/button";


// --------------------------------------------------
// VALIDATION
// --------------------------------------------------

const createUnitSchema = (t) => z.object({
  unit_name: z
    .string()
    .trim()
    .min(1, t("pleaseProvideUnitName")),

  unit_symbole: z
    .string()
    .trim()
    .optional(),
});


// --------------------------------------------------
// DEFAULT VALUES
// --------------------------------------------------

const defaultValues = {
  unit_name: "",
  unit_symbole: "",
};


// --------------------------------------------------
// UNIT FORM
// --------------------------------------------------

export default function UnitForm({
  unit,
  onSubmit,
  loading,
}) {
  const { t } = useTranslation();
  const unitSchema = useMemo(() => createUnitSchema(t), [t]);
  // SERVER ERROR
  const [serverError, setServerError] = useState("");


  // --------------------------------------------------
  // FORM
  // --------------------------------------------------

  const form = useForm({
    resolver: zodResolver(unitSchema),
    defaultValues,
  });


  // --------------------------------------------------
  // LOAD EDIT DATA
  // --------------------------------------------------

  useEffect(() => {

    if (unit) {

      form.reset({
        unit_name: unit.unit_name || "",
        unit_symbole: unit.unit_symbole || "",
      });

    } else {

      form.reset(defaultValues);

    }

    setServerError("");
    form.clearErrors();

  }, [unit]);


  // --------------------------------------------------
  // FIELDS
  // --------------------------------------------------

  const fields = [

    {
      name: "unit_name",
      label: t("unitName"),
      type: "input",
      placeholder: t("enterUnitName"),
      description: t("unitNameExamples"),
    },

    {
      name: "unit_symbole",
      label: t("unitSymbol"),
      type: "input",
      placeholder: t("enterUnitSymbol"),
      description: t("unitSymbolExamples"),
    },

  ];


  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------

  async function handleSubmit(data) {

    try {

      setServerError("");
      form.clearErrors("root.server");

      const unitData = {
        unit_name: data.unit_name.trim(),

        unit_symbole:
          data.unit_symbole?.trim() || "",
      };

      await onSubmit(unitData);

    } catch (err) {

      const message = translateApiError(err, t, "unexpectedError");

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

    if (unit) {

      form.reset({
        unit_name: unit.unit_name || "",
        unit_symbole: unit.unit_symbole || "",
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


      {/* FORM */}

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
            {t("reset")}
          </Button>

          <Button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading
              ? t("saving")
              : unit
                ? t("updateUnit")
                : t("addUnit")}
          </Button>

        </div>

      </GeneralForm>

    </div>

  );
}
