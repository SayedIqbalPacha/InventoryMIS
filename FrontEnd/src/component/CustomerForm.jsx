import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import GeneralForm from "@/component/GeneralForm";

import { Button } from "@/components/ui/button";


// CUSTOMER SCHEMA

const customerSchema = z.object({

  customer_name: z
    .string()
    .trim()
    .min(2,"Customer name must be at least 2 characters")
    .max(50,"Customer name cannot exceed 50 characters"),

  contact_person: z
    .string()
    .trim()
    .max(50,"Contact person cannot exceed 50 characters"),


  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]+$/,"Please enter a valid phone number")
    .min(7,"Phone number is too short")
    .max(20,"Phone number is too long"),


  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(200,"Email cannot exceed 200 characters"),


  address: z
    .string()
    .trim()
    .max(200,"Address cannot exceed 200 characters"),

});


const defaultValues = {

  customer_name: "",

  contact_person: "",

  phone: "",

  email: "",

  address: "",

};


export default function CustomerForm({customer,onSubmit,loading,}) {

  const form = useForm({

    resolver: zodResolver(customerSchema),

    defaultValues,

    mode: "onBlur",

  });


  // LOAD CUSTOMER WHEN EDITING

  useEffect(() => {

    if (customer) {

      form.reset({

        customer_name:
          customer.customer_name || "",

        contact_person:
          customer.contact_person || "",

        phone:
          customer.phone || "",

        email:
          customer.email || "",

        address:
          customer.address || "",

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

        message:
          error.message ||
          "Something went wrong.",

      });

    }

  }


  const fields = [

    {
      name: "customer_name",
      label: "Customer Name",
      type: "input",
      placeholder: "Enter customer name",
    },


    {
      name: "contact_person",
      label: "Contact Person",
      type: "input",
      placeholder: "Enter contact person",
    },


    {
      name: "phone",
      label: "Phone",
      type: "input",
      inputType: "tel",
      placeholder: "Enter phone number",
    },


    {
      name: "email",
      label: "Email",
      type: "input",
      inputType: "email",
      placeholder: "Enter email address",
    },


    {
      name: "address",
      label: "Address",
      type: "textarea",
      placeholder: "Enter customer address",
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

        <div className="flex justify-end gap-2">

          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => {

              form.reset(defaultValues);

              form.clearErrors();

            }}
          >
            Reset
          </Button>


          <Button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : customer
                ? "Update Customer"
                : "Add Customer"}
          </Button>

        </div>

      </GeneralForm>

    </div>

  );
}