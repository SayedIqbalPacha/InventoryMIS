import { Controller } from "react-hook-form";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


export default function GeneralForm({form,fields,onSubmit,children,}) {

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>

      <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">

        {fields.map((fieldConfig) => (

          <Controller
            key={fieldConfig.name}
            name={fieldConfig.name}
            control={form.control}
   
              //this function is provided by controller to connect our ui components like input to react hook form
            render={({ field, fieldState }) => (
              // field.value
              // field.onChange
              // field.onBlur
              // field.name
              // field.ref

              // fieldState.error
              // fieldState.invalid
              // fieldState.isTouched

              <Field
                data-invalid={fieldState.invalid}
              >

                <FieldLabel htmlFor={field.name}>
                  {fieldConfig.label}
                </FieldLabel>


                {/* INPUT */}

                {fieldConfig.type === "input" && (
                  <Input
                    {...field}
                    id={field.name}
                    type={
                      fieldConfig.inputType || "text"
                    }
                    placeholder={
                      fieldConfig.placeholder
                    }
                    aria-invalid={
                      fieldState.invalid
                    }
                  />
                )}


                {/* TEXTAREA */}

                {fieldConfig.type === "textarea" && (
                  <Textarea
                    {...field}
                    id={field.name}
                    placeholder={
                      fieldConfig.placeholder
                    }
                    aria-invalid={
                      fieldState.invalid
                    }
                  />
                )}


                {/* SELECT */}

                {fieldConfig.type === "select" && (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                  >

                    <SelectTrigger
                      id={field.name}
                      aria-invalid={
                        fieldState.invalid
                      }
                    >
                      <SelectValue
                        placeholder={
                          fieldConfig.placeholder
                        }
                      />
                    </SelectTrigger>

                    <SelectContent>

                      {fieldConfig.options?.map(
                        (option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </SelectItem>
                        )
                      )}

                    </SelectContent>

                  </Select>
                )}


                {/* DESCRIPTION */}

                {fieldConfig.description && (
                  <FieldDescription>
                    {fieldConfig.description}
                  </FieldDescription>
                )}


                {/* ERROR */}

                {fieldState.invalid && (
                  <FieldError
                    errors={[fieldState.error]}
                  />
                )}

              </Field>

            )}
          />

        ))}


      </FieldGroup>
               {children}

    </form>
  );
}