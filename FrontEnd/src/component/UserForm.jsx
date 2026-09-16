import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import GeneralForm from "@/component/GeneralForm";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useAuth } from "@/contexts/AuthContext";

import { createUser, updateUser } from "@/services/users";

const userSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please provide a valid email"),

  password: z.string().optional(),

  passwordConfirm: z.string().optional(),

  role: z.enum(["admin", "manager", "user"]),
});

const createSchema = userSchema
  .extend({
    password: z.string().min(8, "Password must be at least 8 characters"),

    passwordConfirm: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Passwords are not the same",
  });

export default function UserForm({
  user = null,
  open,
  onOpenChange,
  onSuccess,
}) {
  const { user: currentUser } = useAuth();

  const isEditing = Boolean(user);

  const form = useForm({
    resolver: zodResolver(isEditing ? userSchema : createSchema),

    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
      role: "user",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  // RESET / LOAD FORM DATA
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name ?? "",
        email: user.email ?? "",
        password: "",
        passwordConfirm: "",
        role: user.role ?? "user",
      });
    } else {
      form.reset({
        name: "",
        email: "",
        password: "",
        passwordConfirm: "",
        role: "user",
      });
    }

    form.clearErrors();
  }, [user, open]);

  // ROLE OPTIONS
  const roleOptions =
    currentUser?.role === "manager"
      ? [
          {
            value: "manager",
            label: "Manager",
          },
          {
            value: "user",
            label: "User",
          },
        ]
      : [
          {
            value: "admin",
            label: "Admin",
          },
          {
            value: "manager",
            label: "Manager",
          },
          {
            value: "user",
            label: "User",
          },
        ];

  // FORM FIELDS
  const fields = [
    {
      name: "name",
      label: "Name",
      type: "input",
      inputType: "text",
      placeholder: "Enter user name",
    },

    {
      name: "email",
      label: "Email",
      type: "input",
      inputType: "email",
      placeholder: "Enter email address",
    },

    ...(!isEditing
      ? [
          {
            name: "password",
            label: "Password",
            type: "input",
            inputType: "password",
            placeholder: "Enter password",
          },

          {
            name: "passwordConfirm",
            label: "Confirm Password",
            type: "input",
            inputType: "password",
            placeholder: "Confirm password",
          },
        ]
      : []),

    {
      name: "role",
      label: "Role",
      type: "select",
      placeholder: "Select role",
      options: roleOptions,
    },
  ];

  async function handleSubmit(data) {
    try {
      form.clearErrors();

      if (isEditing) {
        // Password fields must NOT be sent during update.
        const updateData = {
          name: data.name,
          email: data.email,
          role: data.role,
        };

        await updateUser(user.user_id, updateData);
      } else {
        await createUser({
          name: data.name,
          email: data.email,
          password: data.password,
          passwordConfirm: data.passwordConfirm,
          role: data.role,
        });
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      form.setError("root.server", {
        type: "server",
        message: error?.message || "Something went wrong. Please try again.",
      });
    }
  }

  const defaultValues = isEditing
    ? {
        name: user?.name ?? "",
        email: user?.email ?? "",
        role: user?.role ?? "user",
      }
    : {
        name: "",
        email: "",
        password: "",
        passwordConfirm: "",
        role: "user",
      };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className=" w-[calc(100%-2rem)]
          max-w-4xl
          max-h-[90vh]
          overflow-y-auto
          sm:max-w-5xl
                       "
      >
        <DialogHeader>
          <DialogTitle>{isEditing ? "Update User" : "Add User"}</DialogTitle>

          <DialogDescription>
            {isEditing
              ? "Update the user's information and role."
              : "Create a new system user."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* SERVER ERROR */}
          {form.formState.errors.root?.server && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {form.formState.errors.root.server.message}
            </div>
          )}

          <GeneralForm form={form} fields={fields} onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
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
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting
                  ? "Saving..."
                  : isEditing
                    ? "Update User"
                    : "Add User"}
              </Button>
            </div>
          </GeneralForm>
        </div>
      </DialogContent>
    </Dialog>
  );
}
