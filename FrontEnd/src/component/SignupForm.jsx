import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

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
// SIGNUP SCHEMA
// --------------------------------------------------

const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must not exceed 100 characters"),

    email: z
      .string()
      .trim()
      .min(1, "Please provide your email")
      .email("Please provide a valid email"),

    password: z
      .string()
      .min(5, "Password must be at least 5 characters"),

    passwordConfirm: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine(
    (data) => data.password === data.passwordConfirm,
    {
      message: "Passwords do not match",
      path: ["passwordConfirm"],
    }
  );


// --------------------------------------------------
// SIGNUP COMPONENT
// --------------------------------------------------

export function SignupForm() {

  const navigate = useNavigate();

  const { signup } = useAuth();

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(signupSchema),

    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
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

      await signup(data);

      navigate("/login", {
        replace: true,
        state: {
          message:
            "Account created successfully. Please login.",
        },
      });

    } catch (error) {

      setServerError(error.message || "Unable to create account.");

    } finally {

      setLoading(false);

    }
  }


  return (
    <Card className="w-full max-w-sm shadow-md">

      {/* HEADER */}

      <CardHeader>

        <CardTitle>
          Create an account
        </CardTitle>

        <CardDescription>
          Enter your information to create your account
        </CardDescription>

        <CardAction>

          <Link to="/login">

            <Button
              type="button"
              variant="link"
              
            >
              Login
            </Button>

          </Link>

        </CardAction>

      </CardHeader>


      {/* FORM */}

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >

        <CardContent>

          <div className="flex flex-col gap-5">

            {/* NAME */}

            <div className="grid gap-2">

              <Label htmlFor="name">
                Name
              </Label>

              <Input
                id="name"
                type="text"
                placeholder="Your name"
                autoComplete="name"
                {...form.register("name")}
                aria-invalid={
                  !!form.formState.errors.name
                }
              />

              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {
                    form.formState.errors.name.message
                  }
                </p>
              )}

            </div>


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

              <Label htmlFor="password">
                Password
              </Label>

              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                {...form.register("password")}
                aria-invalid={
                  !!form.formState.errors.password
                }
              />

              {form.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {
                    form.formState.errors.password.message
                  }
                </p>
              )}

            </div>


            {/* PASSWORD CONFIRM */}

            <div className="grid gap-2">

              <Label htmlFor="passwordConfirm">
                Confirm Password
              </Label>

              <Input
                className="mb-2"
                id="passwordConfirm"
                type="password"
                autoComplete="new-password"
                {...form.register("passwordConfirm")}
                aria-invalid={
                  !!form.formState.errors.passwordConfirm
                }
              />

              {form.formState.errors.passwordConfirm && (
                <p className="text-sm text-destructive">
                  {
                    form.formState.errors.passwordConfirm.message
                  }
                </p>
              )}

            </div>


            {/* SERVER ERROR */}

            {serverError && (
              <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 my-1 text-sm text-destructive">
                {serverError}
              </div>
            )}

          </div>

        </CardContent>


        {/* FOOTER */}

        <CardFooter>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create account"}
          </Button>

        </CardFooter>

      </form>

    </Card>
  );
}