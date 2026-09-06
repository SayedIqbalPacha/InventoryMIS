import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
// RESET PASSWORD SCHEMA
// --------------------------------------------------

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),

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
// RESET PASSWORD COMPONENT
// --------------------------------------------------

export function ResetPasswordForm() {

  const { token } = useParams();

  const { resetPassword } = useAuth();

  const navigate = useNavigate();

  const [serverError, setServerError] = useState("");

  const [loading, setLoading] = useState(false);


  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),

    defaultValues: {
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


      await resetPassword(token,data.password,data.passwordConfirm);


      // PASSWORD RESET SUCCESSFUL
      navigate("/login", {
        replace: true,
        state: {
          message:
            "Password reset successfully. Please login.",
        },
      });

    } catch (error) {

      setServerError( error.message ||"Unable to reset password.");

    } finally {

      setLoading(false);

    }
  }


  return (
    <Card className="w-full max-w-sm shadow-md">

      <CardHeader>

        <CardTitle>
          Reset your password
        </CardTitle>

        <CardDescription>
          Enter your new password below.
        </CardDescription>

      </CardHeader>


      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >

        <CardContent>

          <div className="flex flex-col gap-5">


            {/* PASSWORD */}

            <div className="grid gap-2">

              <Label htmlFor="password">
                New Password
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
                Confirm New Password
              </Label>

              <Input
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
              <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 mb-2 text-sm text-destructive">
                {serverError}
              </div>
            )}

          </div>

        </CardContent>


        <CardFooter className="flex-col gap-3">

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading
              ? "Resetting..."
              : "Reset password"}
          </Button>


          <Link
            to="/login"
            className="text-sm underline-offset-4 hover:underline"
          >
            Back to login
          </Link>

        </CardFooter>

      </form>

    </Card>
  );
}