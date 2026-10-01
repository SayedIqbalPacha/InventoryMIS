import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { translateApiError } from "@/lib/translateApiError";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


// --------------------------------------------------
// LOGIN SCHEMA
// --------------------------------------------------

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Please provide your email")
    .email("Please provide a valid email"),

  password: z
    .string()
    .min(1, "Please provide your password"),
});


// --------------------------------------------------
// LOGIN COMPONENT
// --------------------------------------------------

export function LoginSignup() {
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();

  // GET LOGIN FUNCTION FROM AUTH CONTEXT
  const { login } = useAuth();

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);


  // ------------------------------------------------
  // FORM
  // ------------------------------------------------

  const form = useForm({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
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

      form.clearErrors();


      // LOGIN THROUGH AUTH CONTEXT
      await login(data.email, data.password);


      // LOGIN SUCCESS
      navigate("/dashboard", {
        replace: true,
      });


    } catch (error) {

      setServerError(translateApiError(error, t, i18n, "unableToLogin"));

    } finally {

      setLoading(false);

    }
  }


  return (

    <Card className="w-full max-w-sm shadow-md">

      {/* ======================================== */}
      {/* HEADER */}
      {/* ======================================== */}

      <CardHeader>

        <CardTitle>
          {t("loginTitle")}
        </CardTitle>

        <CardDescription>
          {t("loginDescription")}
        </CardDescription>

        <CardAction>

          <Link to="/signup">

            <Button
              type="button"
              variant="link"
            >
              {t("signUp")}
            </Button>

          </Link>

        </CardAction>

      </CardHeader>


      {/* ======================================== */}
      {/* FORM */}
      {/* ======================================== */}

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >

        <CardContent>

          <div className="flex flex-col gap-6">


            {/* EMAIL */}

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


            {/* PASSWORD */}

            <div className="grid gap-2">

              <div className="flex items-center">

                <Label htmlFor="password">
                  {t("password")}
                </Label>

                <Link
                  to="/forgot-password"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  {t("forgotYourPassword")}
                </Link>

              </div>


              <Input
                id="password"
                type="password"
                autoComplete="current-password"

                {...form.register("password")}

                aria-invalid={
                  !!form.formState.errors.password
                }
              />

              {form.formState.errors.password && (

                <p className="text-sm text-destructive">

                  {
                    t(form.formState.errors.password.message)
                  }

                </p>

              )}

            </div>


            {/* BACKEND ERROR */}

            {serverError && (

              <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 my-2 text-sm text-destructive">

                {serverError}

              </div>

            )}

          </div>

        </CardContent>


        {/* ====================================== */}
        {/* FOOTER / BUTTONS */}
        {/* ====================================== */}

        <CardFooter className="flex-col gap-2">

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >

            {loading
              ? t("loggingIn")
              : t("login")}

          </Button>


          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled
          >
            {t("loginWithGoogle")}
          </Button>

        </CardFooter>

      </form>

    </Card>

  );
}
