import { useState } from "react";
import { useTranslation } from "react-i18next";
import { translateApiError } from "@/lib/translateApiError";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


// --------------------------------------------------
// FORGOT PASSWORD SCHEMA
// --------------------------------------------------

const forgotPasswordSchema = z.object({

  email: z
    .string()
    .trim()
    .min(1, "Please provide your email")
    .email("Please provide a valid email"),

});


// --------------------------------------------------
// FORGOT PASSWORD COMPONENT
// --------------------------------------------------

export function ForgotPasswordForm() {
  const { t, i18n } = useTranslation();

  const { forgotPassword } = useAuth();

  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [loading, setLoading] = useState(false);


  const form = useForm({

    resolver: zodResolver(
      forgotPasswordSchema
    ),

    defaultValues: {
      email: "",
    },

    mode: "onBlur",

  });


  // ------------------------------------------------
  // SUBMIT
  // ------------------------------------------------

  async function onSubmit(data) {

    try {

      setLoading(true);

      setServerError("");
      setSuccessMessage("");

      form.clearErrors();


      await forgotPassword(data.email);


      setSuccessMessage(t("resetLinkSent"));

      form.reset();

    } catch (error) {

      setServerError(translateApiError(error, t, i18n, "unableToProcessRequest"));

    } finally {

      setLoading(false);

    }

  }


  return (
    <Card className="w-full max-w-sm shadow-md">

      {/* HEADER */}

      <CardHeader>

        <CardTitle>
          {t("forgotPasswordTitle")}
        </CardTitle>

        <CardDescription>
          {t("forgotPasswordDescription")}
        </CardDescription>

      </CardHeader>


      {/* FORM */}

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >

        <CardContent>

          <div className="grid gap-2">

            <Label htmlFor="email">
              {t("email")}
            </Label>

            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              autoComplete="email"
              {...form.register("email")}
              aria-invalid={
                !!form.formState.errors.email
              }
            />

            {form.formState.errors.email && (
              <p className="text-sm text-destructive">
                {
                  t(form.formState.errors.email.message)
                }
              </p>
            )}

          </div>


          {/* SERVER ERROR */}

          {serverError && (

            <div className="mt-4 rounded-md border border-destructive/50 bg-destructive/10 p-3 my-2 text-sm text-destructive">
              {serverError}
            </div>

          )}


          {/* SUCCESS */}

          {successMessage && (

            <div className="mt-4 rounded-md border border-green-500/50 bg-green-500/10 my-2 p-3 text-sm">
              {successMessage}
            </div>

          )}

        </CardContent>


        {/* FOOTER */}

        <CardFooter className="flex flex-col gap-3">

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading
              ? t("sending")
              : t("sendResetLink")}
          </Button>


          <Link
            to="/login"
            className="text-sm underline-offset-4 hover:underline"
          >
            {t("backToLogin")}
          </Link>

        </CardFooter>

      </form>

    </Card>
  );
}
