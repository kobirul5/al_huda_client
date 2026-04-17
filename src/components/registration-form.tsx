/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Field,
  FieldLabel,
  FieldContent,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useActionState, useEffect, useState } from "react";
import { registerUser } from "@/services/auth/register";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  LucideLoader2,
  LucideArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function RegistrationForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(registerUser, null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (state?.success) {
      const email = state.data?.user?.email || "";
      if (email) {
        sessionStorage.setItem("resetEmail", email);
        sessionStorage.setItem("otpType", "verify");
      }
      router.push("/");
    }
  }, [state, router]);

  const getFieldError = (fieldName: string) => {
    if (!state?.errors) return null;

    const fieldError = state.errors.find((err: any) => err.field === fieldName);
    return fieldError?.message ?? null;
  };

  return (
    <form action={formAction} className="space-y-4">
      {state?.success === false && state?.message && (
        <div className="rounded-2xl border border-red-200 bg-red-100 p-3 text-sm text-red-600">
          {state.message}
        </div>
      )}

      <FieldGroup className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field className="space-y-1">
            <FieldLabel className="ml-1 text-sm font-medium text-foreground/80">
              First Name <span className="italic text-primary">*</span>
            </FieldLabel>
            <FieldContent>
              <Input
                name="firstName"
                placeholder="John"
                disabled={isPending}
                className="h-12 rounded-xl border-border bg-white transition-all focus:border-primary/50 focus:ring-primary/20"
              />
            </FieldContent>
            {getFieldError("firstName") && (
              <p className="mt-1.5 ml-1 animate-in slide-in-from-top-1 text-xs font-bold text-destructive fade-in duration-300">
                {getFieldError("firstName")}
              </p>
            )}
          </Field>

          <Field className="space-y-1">
            <FieldLabel className="ml-1 text-sm font-medium text-foreground/80">Last Name</FieldLabel>
            <FieldContent>
              <Input
                name="lastName"
                placeholder="Doe"
                disabled={isPending}
                className="h-12 rounded-xl border-border bg-white transition-all focus:border-primary/50 focus:ring-primary/20"
              />
            </FieldContent>
            {getFieldError("lastName") && (
              <p className="mt-1.5 ml-1 animate-in slide-in-from-top-1 text-xs font-bold text-destructive fade-in duration-300">
                {getFieldError("lastName")}
              </p>
            )}
          </Field>
        </div>

        <Field className="space-y-1">
          <FieldLabel className="ml-1 text-sm font-medium text-foreground/80">
            Email Address <span className="italic text-primary">*</span>
          </FieldLabel>
          <FieldContent>
            <Input
              name="email"
              type="email"
              placeholder="john@example.com"
              disabled={isPending}
              className="h-12 rounded-xl border-border bg-white transition-all focus:border-primary/50 focus:ring-primary/20"
            />
          </FieldContent>
          {getFieldError("email") && (
            <p className="mt-1.5 ml-1 animate-in slide-in-from-top-1 text-xs font-bold text-destructive fade-in duration-300">
              {getFieldError("email")}
            </p>
          )}
        </Field>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field className="space-y-1">
            <FieldLabel className="ml-1 text-sm font-medium text-foreground/80">Phone Number</FieldLabel>
            <FieldContent>
              <Input
                name="phoneNumber"
                placeholder="+1234567890"
                disabled={isPending}
                className="h-12 rounded-xl border-border bg-white transition-all focus:border-primary/50 focus:ring-primary/20"
              />
            </FieldContent>
            {getFieldError("phoneNumber") && (
              <p className="mt-1.5 ml-1 animate-in slide-in-from-top-1 text-xs font-bold text-destructive fade-in duration-300">
                {getFieldError("phoneNumber")}
              </p>
            )}
          </Field>

          <Field className="space-y-1">
            <FieldLabel className="ml-1 text-sm font-medium text-foreground/80">Age</FieldLabel>
            <FieldContent>
              <Input
                name="age"
                type="number"
                placeholder="25"
                disabled={isPending}
                className="h-12 rounded-xl border-border bg-white transition-all focus:border-primary/50 focus:ring-primary/20"
              />
            </FieldContent>
            {getFieldError("age") && (
              <p className="mt-1.5 ml-1 animate-in slide-in-from-top-1 text-xs font-bold text-destructive fade-in duration-300">
                {getFieldError("age")}
              </p>
            )}
          </Field>
        </div>

        <Field className="space-y-1">
          <FieldLabel className="ml-1 text-sm font-medium text-foreground/80">Gender</FieldLabel>
          <FieldContent className="group relative">
            <select
              name="gender"
              disabled={isPending}
              className={cn(
                "flex h-12 w-full appearance-none rounded-xl border border-border bg-white px-4 py-1 text-sm font-medium text-foreground/80 shadow-sm transition-all focus:border-primary/50 focus:ring-primary/20 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              )}
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
            <div className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary">
              <LucideArrowRight size={14} className="rotate-90" />
            </div>
          </FieldContent>
          {getFieldError("gender") && (
            <p className="mt-1.5 ml-1 animate-in slide-in-from-top-1 text-xs font-bold text-destructive fade-in duration-300">
              {getFieldError("gender")}
            </p>
          )}
        </Field>

        <Field className="space-y-1">
          <FieldLabel className="ml-1 text-sm font-medium text-foreground/80">Address</FieldLabel>
          <FieldContent>
            <Input
              name="address"
              placeholder="123 Main St, City"
              disabled={isPending}
              className="h-12 rounded-xl border-border bg-white transition-all focus:border-primary/50 focus:ring-primary/20"
            />
          </FieldContent>
          {getFieldError("address") && (
            <p className="mt-1.5 ml-1 animate-in slide-in-from-top-1 text-xs font-bold text-destructive fade-in duration-300">
              {getFieldError("address")}
            </p>
          )}
        </Field>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field className="space-y-1">
            <FieldLabel className="ml-1 text-sm font-medium text-foreground/80">
              Password <span className="italic text-primary">*</span>
            </FieldLabel>
            <FieldContent>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  disabled={isPending}
                  className="h-12 rounded-xl border-border bg-white pr-12 transition-all focus:border-primary/50 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground transition hover:text-primary"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isPending}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </FieldContent>
            {getFieldError("password") && (
              <p className="mt-1.5 ml-1 animate-in slide-in-from-top-1 text-xs font-bold text-destructive fade-in duration-300">
                {getFieldError("password")}
              </p>
            )}
          </Field>

          <Field className="space-y-1">
            <FieldLabel className="ml-1 text-sm font-medium text-foreground/80">
              Confirm Password <span className="italic text-primary">*</span>
            </FieldLabel>
            <FieldContent>
              <div className="relative">
                <Input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="********"
                  disabled={isPending}
                  className="h-12 rounded-xl border-border bg-white pr-12 transition-all focus:border-primary/50 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground transition hover:text-primary"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  disabled={isPending}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </FieldContent>
            {getFieldError("confirmPassword") && (
              <p className="mt-1.5 ml-1 animate-in slide-in-from-top-1 text-xs font-bold text-destructive fade-in duration-300">
                {getFieldError("confirmPassword")}
              </p>
            )}
          </Field>
        </div>
      </FieldGroup>

      <Button
        type="submit"
        className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.99] disabled:opacity-70"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <LucideLoader2 className="animate-spin" size={20} />
            <span>Creating Account...</span>
          </>
        ) : (
          <>
            <span>Create Account</span>
            <LucideArrowRight className="transition-transform group-hover:translate-x-1" size={20} />
          </>
        )}
      </Button>
    </form>
  );
}
