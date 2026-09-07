import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import GeneralForm from "@/component/GeneralForm";
import { Button } from "@/components/ui/button";


// --------------------------------------------------
// VALIDATION
// --------------------------------------------------

const catagorySchema = z.object({
  catagory_name: z
    .string()
    .trim()
    .min(1, "Please provide a catagory name."),

  catagory_description: z
    .string()
    .trim()
    .optional(),
});


// --------------------------------------------------
// DEFAULT VALUES
// --------------------------------------------------

const defaultValues = {
  catagory_name: "",
  catagory_description: "",
};


// --------------------------------------------------
// CATAGORY FORM
// --------------------------------------------------

export default function CatagoryForm({
  catagory,
  onSubmit,
  loading,
}) {

  // SERVER ERROR
  const [serverError, setServerError] = useState("");


  // --------------------------------------------------
  // FORM
  // --------------------------------------------------

  const form = useForm({
    resolver: zodResolver(catagorySchema),
    defaultValues,
  });


  // --------------------------------------------------
  // LOAD EDIT DATA
  // --------------------------------------------------

  useEffect(() => {

    if (catagory) {

      form.reset({
        catagory_name: catagory.catagory_name || "",
        catagory_description:
          catagory.catagory_description || "",
      });

    } else {

      form.reset(defaultValues);

    }

    setServerError("");
    form.clearErrors();

  }, [catagory]);


  // --------------------------------------------------
  // FIELDS
  // --------------------------------------------------

  const fields = [

    {
      name: "catagory_name",
      label: "Catagory Name",
      type: "input",
      placeholder: "Enter catagory name",
    },

    {
      name: "catagory_description",
      label: "Catagory Description",
      type: "textarea",
      placeholder: "Enter catagory description",
    },

  ];


  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------

  async function handleSubmit(data) {

    try {

      setServerError("");

      form.clearErrors("root.server");

      await onSubmit(data);

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

    form.reset(
      catagory
        ? {
            catagory_name:
              catagory.catagory_name || "",
            
          }
        : defaultValues
    );

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

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">

          {/* RESET */}

          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={handleReset}
            className="w-full sm:w-auto"
          >
            Reset
          </Button>


          {/* SUBMIT */}

          <Button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto"
          >

            {loading
              ? "Saving..."
              : catagory
                ? "Update Catagory"
                : "Add Catagory"}

          </Button>

        </div>

      </GeneralForm>

    </div>

  );
}