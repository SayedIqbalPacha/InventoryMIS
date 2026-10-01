import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { translateApiError } from "@/lib/translateApiError";
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

const createUserSchemas = (t) => {
const userSchema = z.object({
  name: z.string().trim().min(1, t("nameRequired")),

  email: z
    .string()
    .trim()
    .min(1, t("emailRequired"))
    .email(t("pleaseProvideValidEmail")),

  password: z.string().optional(),

  passwordConfirm: z.string().optional(),

  role: z.enum(["admin", "manager", "user"]),
});

const createSchema = userSchema
  .extend({
    password: z.string().min(8, t("passwordMinLength")),

    passwordConfirm: z.string().min(1, t("confirmPasswordRequired")),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: t("passwordsDoNotMatch"),
  });
  return { userSchema, createSchema };
};

export default function UserForm({
  user = null,
  open,
  onOpenChange,
  onSuccess,
}) {
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();

  const isEditing = Boolean(user);
  const schemas = useMemo(() => createUserSchemas(t), [t]);

  const form = useForm({
    resolver: zodResolver(isEditing ? schemas.userSchema : schemas.createSchema),

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
            label: t("manager"),
          },
          {
            value: "user",
            label: t("user"),
          },
        ]
      : [
          {
            value: "admin",
            label: t("admin"),
          },
          {
            value: "manager",
            label: t("manager"),
          },
          {
            value: "user",
            label: t("user"),
          },
        ];

  // FORM FIELDS
  const fields = [
    {
      name: "name",
      label: t("name"),
      type: "input",
      inputType: "text",
      placeholder: t("enterUserName"),
    },

    {
      name: "email",
      label: t("email"),
      type: "input",
      inputType: "email",
      placeholder: t("enterEmailAddress"),
    },

    ...(!isEditing
      ? [
          {
            name: "password",
            label: t("password"),
            type: "input",
            inputType: "password",
            placeholder: t("enterPassword"),
          },

          {
            name: "passwordConfirm",
            label: t("confirmPassword"),
            type: "input",
            inputType: "password",
            placeholder: t("confirmPassword"),
          },
        ]
      : []),

    {
      name: "role",
      label: t("role"),
      type: "select",
      placeholder: t("selectRole"),
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
        message: translateApiError(error, t, "unexpectedError"),
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
          <DialogTitle>{isEditing ? t("updateUser") : t("addUser")}</DialogTitle>

          <DialogDescription>
            {isEditing
              ? t("updateUserInfo")
              : t("createSystemUser")}
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
                {t("reset")}
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting
                  ? t("saving")
                  : isEditing
                    ? t("updateUser")
                    : t("addUser")}
              </Button>
            </div>
          </GeneralForm>
        </div>
      </DialogContent>
    </Dialog>
  );
}
