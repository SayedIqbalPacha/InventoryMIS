import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import GeneralForm from "@/component/GeneralForm";
import { Button } from "@/components/ui/button";


// --------------------------------------------------
// VALIDATION
// --------------------------------------------------

const itemSchema = z.object({
  item_name: z
    .string()
    .trim()
    .min(1, "Please provide an item name."),

  description: z
    .string()
    .trim()
    .optional(),

  sell_price: z.preprocess(
    (value) =>
      value === "" || value === undefined
        ? undefined
        : Number(value),
    z.number({
        message: "Sell price must be a number.",
      })
      .min(0, "Sell price cannot be negative.")
  ),

  cost_price: z.preprocess(
    (value) =>
      value === "" || value === undefined
        ? undefined
        : Number(value),
    z.number({
        message: "Cost price must be a number.",
      })
      .min(0, "Cost price cannot be negative.")
      .optional()
  ),

  stock_quantity: z.preprocess(
    (value) =>
      value === "" || value === undefined
        ? undefined
        : Number(value),
    z.number({
        message: "Stock quantity must be a number.",
      })
      .min(0, "Stock quantity cannot be negative.")
      .optional()
  ),

  unit_id: z
    .string()
    .optional(),

  catagory_id: z
    .string()
    .optional(),
});


// --------------------------------------------------
// DEFAULT VALUES
// --------------------------------------------------

const defaultValues = {
  item_name: "",
  description: "",
  sell_price: "",
  cost_price: "",
  stock_quantity: "",
  unit_id: "",
  catagory_id: "",
};


// --------------------------------------------------
// ITEM FORM
// --------------------------------------------------

export default function ItemForm({
  item,
  units = [],
  catagories = [],
  onSubmit,
  loading,
}) {

  const [serverError, setServerError] = useState("");


  // --------------------------------------------------
  // FORM
  // --------------------------------------------------

  const form = useForm({
    resolver: zodResolver(itemSchema),
    defaultValues,
  });


  // --------------------------------------------------
  // EDIT DATA
  // --------------------------------------------------

  useEffect(() => {

    if (item) {

      form.reset({
        item_name: item.item_name || "",

        description:
          item.description || "",

        sell_price:
          item.sell_price ?? "",

        cost_price:
          item.cost_price ?? "",

        stock_quantity:
          item.stock_quantity ?? "",

        unit_id:
          item.unit_id != null
            ? String(item.unit_id)
            : "",

        catagory_id:
          item.catagory_id != null
            ? String(item.catagory_id)
            : "",
      });

    } else {

      form.reset(defaultValues);

    }

    setServerError("");
    form.clearErrors();

  }, [item]);


  // --------------------------------------------------
  // FIELDS
  // --------------------------------------------------

  const fields = [

    {
      name: "item_name",
      label: "Item Name",
      type: "input",
      placeholder: "Enter item name",
      description: "Enter the name of the item.",
    },

    {
      name: "sell_price",
      label: "Sell Price",
      type: "input",
      inputType: "number",
      placeholder: "Enter selling price",
      description: "Selling price of the item.",
    },

    {
      name: "cost_price",
      label: "Cost Price",
      type: "input",
      inputType: "number",
      placeholder: "Enter cost price",
      description: "Optional purchase/cost price.",
    },

    {
      name: "stock_quantity",
      label: "Stock Quantity",
      type: "input",
      inputType: "number",
      placeholder: "Enter stock quantity",
      description: "Current available stock.",
    },

    {
      name: "unit_id",
      label: "Unit",
      type: "select",
      placeholder: "Select unit",
      options: units.map((unit) => ({
        value: String(unit.unit_id),
        label: unit.unit_name,
      })),
    },

    {
      name: "catagory_id",
      label: "Catagory",
      type: "select",
      placeholder: "Select catagory",
      options: catagories.map((catagory) => ({
        value: String(catagory.catagory_id),
        label: catagory.catagory_name,
      })),
    },

    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Enter item description",
      description: "Optional description of the item.",
    },

  ];


  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------

  async function handleSubmit(data) {

    try {

      setServerError("");
      form.clearErrors("root.server");

      // Convert numeric fields before sending to API
      const itemData = {
        item_name: data.item_name.trim(),

        description:
          data.description?.trim() || "",

        sell_price: Number(data.sell_price),

        cost_price:
          data.cost_price === "" ||
          data.cost_price === undefined
            ? null
            : Number(data.cost_price),

        stock_quantity:
          data.stock_quantity === "" ||
          data.stock_quantity === undefined
            ? null
            : Number(data.stock_quantity),

        unit_id:
          data.unit_id === "" ||
          data.unit_id === undefined
            ? null
            : Number(data.unit_id),

        catagory_id:
          data.catagory_id === "" ||
          data.catagory_id === undefined
            ? null
            : Number(data.catagory_id),
      };

      await onSubmit(itemData);

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

    if (item) {

      form.reset({
        item_name: item.item_name || "",
        description: item.description || "",
        sell_price: item.sell_price ?? "",
        cost_price: item.cost_price ?? "",
        stock_quantity: item.stock_quantity ?? "",

        unit_id:
          item.unit_id != null
            ? String(item.unit_id)
            : "",

        catagory_id:
          item.catagory_id != null
            ? String(item.catagory_id)
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
              : item
                ? "Update Item"
                : "Add Item"}
          </Button>

        </div>

      </GeneralForm>

    </div>

  );
}
