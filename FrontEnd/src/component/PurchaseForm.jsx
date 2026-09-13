import { useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import GeneralForm from "@/component/GeneralForm";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";


// --------------------------------------------------
// VALIDATION
// --------------------------------------------------

const purchaseSchema = z.object({

  currency_id: z
    .string()
    .min(1, "Please select a currency."),

  vendor_id: z
    .string()
    .min(1, "Please select a vendor."),

  purchase_date: z
    .string()
    .min(1, "Please provide the purchase date."),

  status: z
    .string()
    .trim()
    .optional(),

  details: z
    .array(
      z.object({

        detail_id: z
          .number()
          .optional(),

        item_id: z
          .string()
          .min(1, "Please select an item."),

        quantity: z.preprocess(
          (value) =>
            value === ""
              ? undefined
              : Number(value),

          z
            .number({
              message: "Quantity must be a number.",
            })
            .positive("Quantity must be greater than 0.")
        ),

        unit_price: z.preprocess(
          (value) =>
            value === ""
              ? undefined
              : Number(value),

          z
            .number({
              message: "Unit price must be a number.",
            })
            .min(0, "Unit price cannot be negative.")
        ),

      })
    )
    .min(1, "Please add at least one item."),
});


// --------------------------------------------------
// DEFAULT VALUES
// --------------------------------------------------

const defaultValues = {
  currency_id: "",
  vendor_id: "",
  purchase_date: "",
  status: "",

  details: [
    {
      item_id: "",
      quantity: "",
      unit_price: "",
    },
  ],
};


// --------------------------------------------------
// PURCHASE FORM
// --------------------------------------------------

export default function PurchaseForm({
  purchase,
  currencies = [],
  vendors = [],
  items = [],
  purchaseDetails = [],
  onSubmit,
  loading,
}) {

  const [serverError, setServerError] = useState("");


  // --------------------------------------------------
  // FORM
  // --------------------------------------------------

  const form = useForm({
    resolver: zodResolver(purchaseSchema),
    defaultValues,
  });


  // --------------------------------------------------
  // FIELD ARRAY
  // --------------------------------------------------

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "details",
  });


  // --------------------------------------------------
  // LOAD EDIT DATA
  // --------------------------------------------------

  useEffect(() => {

    if (purchase) {

      const existingDetails = purchaseDetails
        .filter(
          (detail) =>
            Number(detail.purchase_id) ===
            Number(purchase.purchase_id)
        )
        .map((detail) => ({
          detail_id: Number(detail.detail_id),

          item_id:
            detail.item_id != null
              ? String(detail.item_id)
              : "",

          quantity:
            detail.quantity != null
              ? String(detail.quantity)
              : "",

          unit_price:
            detail.unit_price != null
              ? String(detail.unit_price)
              : "",
        }));


      form.reset({

        currency_id:
          purchase.currency_id != null
            ? String(purchase.currency_id)
            : "",

        vendor_id:
          purchase.vendor_id != null
            ? String(purchase.vendor_id)
            : "",

        purchase_date:
          purchase.purchase_date
            ? String(purchase.purchase_date).slice(0, 10)
            : "",

        status:
          purchase.status || "",

        details:
          existingDetails.length > 0
            ? existingDetails
            : defaultValues.details,

      });

    } else {

      form.reset(defaultValues);

    }

    setServerError("");
    form.clearErrors();

  }, [purchase, purchaseDetails, form]);


  // --------------------------------------------------
  // FIELDS
  // --------------------------------------------------

  const fieldsConfig = [

    {
      name: "currency_id",
      label: "Currency",
      type: "select",
      placeholder: "Select currency",

      options: currencies.map((currency) => ({
        value: String(currency.currency_id),
        label: currency.currency_code,
      })),
    },

    {
      name: "vendor_id",
      label: "Vendor",
      type: "select",
      placeholder: "Select vendor",

      options: vendors.map((vendor) => ({
        value: String(vendor.vendor_id),
        label: vendor.vendor_name,
      })),
    },

    {
      name: "purchase_date",
      label: "Purchase Date",
      type: "input",
      inputType: "date",
      placeholder: "Select purchase date",
    },

    {
      name: "status",
      label: "Status",
      type: "input",
      placeholder: "Enter purchase status",
      description: "Enter the current purchase status.",
    },

  ];


  // --------------------------------------------------
  // ITEM LOOKUP
  // --------------------------------------------------

  const itemMap = useMemo(() => {

    return Object.fromEntries(
      items.map((item) => [
        String(item.item_id),
        item,
      ])
    );

  }, [items]);


  // --------------------------------------------------
  // GRAND TOTAL
  // --------------------------------------------------

  const watchedDetails =
    form.watch("details") || [];

  const grandTotal = watchedDetails.reduce(
    (total, detail) => {

      const quantity =
        Number(detail.quantity) || 0;

      const unitPrice =
        Number(detail.unit_price) || 0;

      return (
        total +
        quantity * unitPrice
      );

    },
    0
  );


  // --------------------------------------------------
  // ADD ITEM
  // --------------------------------------------------

  function handleAddItem() {

    append({
      item_id: "",
      quantity: "",
      unit_price: "",
    });

  }


  // --------------------------------------------------
  // ITEM CHANGE
  // --------------------------------------------------

  function handleItemChange(
    value,
    index
  ) {

    const selectedItem =
      itemMap[value];

    form.setValue(
      `details.${index}.item_id`,
      value,
      {
        shouldValidate: true,
      }
    );

    if (
      selectedItem &&
      (
        form.getValues(
          `details.${index}.unit_price`
        ) === "" ||
        form.getValues(
          `details.${index}.unit_price`
        ) === undefined
      )
    ) {

      form.setValue(
        `details.${index}.unit_price`,
        selectedItem.cost_price ?? "",
        {
          shouldValidate: true,
        }
      );

    }

  }


  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------

  async function handleSubmit(data) {

    try {

      setServerError("");

      form.clearErrors("root.server");


      const purchaseData = {

        currency_id:
          Number(data.currency_id),

        vendor_id:
          Number(data.vendor_id),

        purchase_date:
          data.purchase_date,

        total_amount:
          Number(grandTotal.toFixed(2)),

        status:
          data.status?.trim() || "",

      };


      const details = data.details.map(
        (detail) => ({

          ...(detail.detail_id
            ? {
                detail_id:
                  Number(detail.detail_id),
              }
            : {}),

          item_id:
            Number(detail.item_id),

          quantity:
            Number(detail.quantity),

          unit_price:
            Number(detail.unit_price),

        })
      );


      await onSubmit({
        purchaseData,
        details,
      });

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

    if (purchase) {

      const existingDetails =
        purchaseDetails
          .filter(
            (detail) =>
              Number(detail.purchase_id) ===
              Number(purchase.purchase_id)
          )
          .map((detail) => ({
            detail_id:
              Number(detail.detail_id),

            item_id:
              detail.item_id != null
                ? String(detail.item_id)
                : "",

            quantity:
              detail.quantity != null
                ? String(detail.quantity)
                : "",

            unit_price:
              detail.unit_price != null
                ? String(detail.unit_price)
                : "",
          }));


      form.reset({

        currency_id:
          purchase.currency_id != null
            ? String(purchase.currency_id)
            : "",

        vendor_id:
          purchase.vendor_id != null
            ? String(purchase.vendor_id)
            : "",

        purchase_date:
          purchase.purchase_date
            ? String(purchase.purchase_date).slice(0, 10)
            : "",

        status:
          purchase.status || "",

        details:
          existingDetails.length > 0
            ? existingDetails
            : defaultValues.details,

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

    <div className="space-y-6">


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
        fields={fieldsConfig}
        onSubmit={handleSubmit}
      >


        {/* ----------------------------------------- */}
        {/* PURCHASE ITEMS */}
        {/* ----------------------------------------- */}

        <div className="space-y-4 border-t pt-5">

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="text-base font-semibold">
                Purchase Items
              </h2>

              <p className="text-sm text-muted-foreground">
                Add the items included in this purchase.
              </p>

            </div>


            <Button
              type="button"
              variant="outline"
              onClick={handleAddItem}
              className="w-full sm:w-auto"
            >
              Add Item
            </Button>

          </div>


          {/* ----------------------------------------- */}
          {/* ITEMS */}
          {/* ----------------------------------------- */}

          <div className="space-y-4">

            {fields.map((field, index) => {

              const quantity =
                Number(
                  form.watch(
                    `details.${index}.quantity`
                  )
                ) || 0;

              const unitPrice =
                Number(
                  form.watch(
                    `details.${index}.unit_price`
                  )
                ) || 0;

              const lineTotal =
                quantity * unitPrice;


              return (

                <div
                  key={field.id}
                  className="rounded-lg border p-4"
                >

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-12">


                    {/* ITEM */}

                    <div className="md:col-span-12">

                      <Controller
                        name={`details.${index}.item_id`}
                        control={form.control}
                        render={({
                          field,
                          fieldState,
                        }) => (

                          <Field
                            data-invalid={
                              fieldState.invalid
                            }
                          >

                            <FieldLabel>
                              Item
                            </FieldLabel>

                            <Select
                              value={
                                field.value || ""
                              }
                              onValueChange={(
                                value
                              ) =>
                                handleItemChange(
                                  value,
                                  index
                                )
                              }
                            >

                              <SelectTrigger
                                aria-invalid={
                                  fieldState.invalid
                                }
                              >

                                <SelectValue
                                  placeholder="Select item"
                                />

                              </SelectTrigger>

                              <SelectContent>

                                {items.map(
                                  (item) => (

                                    <SelectItem
                                      key={
                                        item.item_id
                                      }
                                      value={String(
                                        item.item_id
                                      )}
                                    >
                                      {item.item_name}
                                    </SelectItem>

                                  )
                                )}

                              </SelectContent>

                            </Select>


                            {fieldState.invalid && (

                              <FieldError
                                errors={[
                                  fieldState.error,
                                ]}
                              />

                            )}

                          </Field>

                        )}
                      />

                    </div>


                    {/* QUANTITY */}

                    <div className="md:col-span-12">

                      <Controller
                        name={`details.${index}.quantity`}
                        control={form.control}
                        render={({
                          field,
                          fieldState,
                        }) => (

                          <Field
                            data-invalid={
                              fieldState.invalid
                            }
                          >

                            <FieldLabel>
                              Quantity
                            </FieldLabel>

                            <Input
                              {...field}
                              type="number"
                              min="0.01"
                              step="any"
                              placeholder="0"
                              aria-invalid={
                                fieldState.invalid
                              }
                            />

                            {fieldState.invalid && (

                              <FieldError
                                errors={[
                                  fieldState.error,
                                ]}
                              />

                            )}

                          </Field>

                        )}
                      />

                    </div>


                    {/* UNIT PRICE */}

                    <div className="md:col-span-12">

                      <Controller
                        name={`details.${index}.unit_price`}
                        control={form.control}
                        render={({
                          field,
                          fieldState,
                        }) => (

                          <Field
                            data-invalid={
                              fieldState.invalid
                            }
                          >

                            <FieldLabel>
                              Unit Price
                            </FieldLabel>

                            <Input
                              {...field}
                              type="number"
                              min="0"
                              step="any"
                              placeholder="0"
                              aria-invalid={
                                fieldState.invalid
                              }
                            />

                            {fieldState.invalid && (

                              <FieldError
                                errors={[
                                  fieldState.error,
                                ]}
                              />

                            )}

                          </Field>

                        )}
                      />

                    </div>


                    {/* LINE TOTAL */}

                    <div className="md:col-span-12">

                      <Field>

                        <FieldLabel>
                          Line Total
                        </FieldLabel>

                        <Input
                          value={lineTotal.toFixed(2)}
                          readOnly
                          className="bg-muted"
                        />

                      </Field>

                    </div>


                    {/* REMOVE */}

                    <div className="flex items-end md:col-span-4">

                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() =>
                          remove(index)
                        }
                        disabled={
                          fields.length === 1
                        }
                        className="w-full"
                      >
                        Remove
                      </Button>

                    </div>

                  </div>

                </div>

              );

            })}

          </div>


          {/* ----------------------------------------- */}
          {/* GRAND TOTAL */}
          {/* ----------------------------------------- */}

          <div className="flex justify-end border-t pt-4">

            <div className="w-full rounded-lg border bg-muted/30 p-4 sm:w-auto sm:min-w-[250px]">

              <div className="flex items-center justify-between gap-6">

                <span className="font-medium">
                  Grand Total
                </span>

                <span className="text-lg font-bold">
                  {grandTotal.toFixed(2)}
                </span>

              </div>

            </div>

          </div>

        </div>


        {/* ----------------------------------------- */}
        {/* BUTTONS */}
        {/* ----------------------------------------- */}

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
              : purchase
                ? "Update Purchase"
                : "Add Purchase"}

          </Button>

        </div>

      </GeneralForm>

    </div>

  );
}