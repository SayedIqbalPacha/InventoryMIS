import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { login } from "@/services/auth";

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

  const navigate = useNavigate();

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

  });


  // ------------------------------------------------
  // SUBMIT
  // ------------------------------------------------

  async function onSubmit(data) {

    try {

      setLoading(true);

      setServerError("");

      form.clearErrors();


      // CALL BACKEND

      const response = await login(data.email,data.password);


      // SAVE JWT

      localStorage.setItem("token", response.token);


      /*
       * Your backend currently needs to return
       * user information as well if you want
       * the frontend to know the role immediately.
       */

      if (response.data) {

        localStorage.setItem("user",JSON.stringify(response.data));

      }


      // REDIRECT

      navigate("/");

    } catch (error) {

      setServerError(
        error.message ||
        "Unable to login."
      );

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
          Login to your account
        </CardTitle>

        <CardDescription>
          Enter your email below to login to your
          account
        </CardDescription>

        <CardAction>

          <Link to="/signup">

            <Button
              type="button"
              variant="link"
            >
              Sign Up
            </Button>

          </Link>

        </CardAction>

      </CardHeader>


      {/* ======================================== */}
      {/* FORM */}
      {/* ======================================== */}

      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>

        <CardContent>

          <div className="flex flex-col gap-6">

            {/* EMAIL */}

            <div className="grid gap-2">

              <Label htmlFor="email">
                Email
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
                    form.formState.errors.email.message
                  }

                </p>

              )}

            </div>


            {/* PASSWORD */}

            <div className="grid gap-2">

              <div className="flex items-center">

                <Label htmlFor="password">
                  Password
                </Label>

                <Link
                  to="#"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
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
                    form.formState.errors.password
                      .message
                  }

                </p>

              )}

            </div>


            {/* BACKEND ERROR */}

            {serverError && (

              <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">

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
              ? "Logging in..."
              : "Login"}

          </Button>


          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled
          >
            Login with Google
          </Button>

        </CardFooter>

      </form>

    </Card>

  );
}