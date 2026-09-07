import { useEffect } from "react";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import GeneralForm from "@/component/GeneralForm";

import { Button } from "@/components/ui/button";


// --------------------------------------------------
// CURRENCY SCHEMA
// --------------------------------------------------

const currencySchema = z.object({

  currency_code: z
    .string()
    .trim()
    .min(1, "Currency code is required")
    .max(10, "Currency code cannot exceed 10 characters"),

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

export default function CurrencyForm({
  currency,
  onSubmit,
  loading,
}) {

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

        currency_code:
          currency.currency_code || "",

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

        message:
          error.message ||
          "Something went wrong.",

      });

    }

  }


  // --------------------------------------------------
  // FIELDS
  // --------------------------------------------------

  const fields = [

    {

      name: "currency_code",

      label: "Currency Code",

      type: "input",

      placeholder: "Enter currency code",

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

          {
            form.formState.errors.root.server.message
          }

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

            Reset

          </Button>


          <Button

            type="submit"

            disabled={loading}

            className="w-full sm:w-auto"

          >

            {loading

              ? "Saving..."

              : currency

                ? "Update Currency"

                : "Add Currency"}

          </Button>

        </div>

      </GeneralForm>

    </div>

  );

}

