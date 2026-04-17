/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Field,
  FieldLabel,
  FieldContent,
  FieldGroup,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useActionState, useEffect, useRef, useState } from "react";
import { loginUser } from "@/services/auth/login";
import Link from "next/link";
import { Eye, EyeOff, LucideArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type QuickLoginProps = {
  quickLoginUser?: { email: string; password: string };
};

export default function LoginForm({ quickLoginUser }: QuickLoginProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginUser, null);
  const formRef = useRef<HTMLFormElement>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (state?.success) {
      if (state.data?.isVerified) {
        toast.success("Login successful!", {
          description: "Welcome back!",
        });
        router.push("/");
      } else {
        const email = state?.data?.email || "";
        if (email) {
          sessionStorage.setItem("resetEmail", email);
          sessionStorage.setItem("otpType", "verify");
        }
        toast.info("Email verification required", {
          description: "Please verify your email to continue.",
        });
        router.push("/verify-otp");
      }
    } else if (state?.errors && state.errors.length > 0) {
      const errorMessage = state.errors.map((err: any) => err.message).join(", ");
      toast.error("Login failed", {
        description: errorMessage,
      });
    } else if (state?.success === false && state?.message) {
      toast.error("Login failed", {
        description: state.message,
      });
    } else if (state?.success === false) {
      toast.error("Login failed", {
        description: "Invalid email or password. Please try again.",
      });
    }
  }, [state, router]);

  const getErrors = (fieldName: string) => {
    if (!state?.errors) return [];
    return state.errors.filter((err: any) => err.field === fieldName);
  };

  const handleQuickLogin = (email: string, password: string) => {
    const form = formRef.current;
    if (!form) return;

    const emailInput = form.querySelector('input[name="email"]') as HTMLInputElement;
    const passwordInput = form.querySelector('input[name="password"]') as HTMLInputElement;

    if (emailInput && passwordInput) {
      emailInput.value = email;
      passwordInput.value = password;
      form.requestSubmit();
    }
  };

  return (
    <>
      {(quickLoginUser ) && (
        <div className="mb-6  grid gap-3 sm:grid-cols-1">
          {quickLoginUser && (
            <Button
              type="button"
              onClick={() => handleQuickLogin(quickLoginUser.email, quickLoginUser.password)}
              variant="outline"
              className="h-11 rounded-xl w-full border-primary/20 bg-primary/5 font-semibold text-primary hover:bg-primary/10"
            >
              Quick User
            </Button>
          )}
         
        </div>
      )}

      <form action={formAction} className="space-y-6" ref={formRef}>
        <FieldGroup className="gap-6">
          <Field>
            <FieldLabel className="mb-2 text-sm font-medium text-foreground/80">Email</FieldLabel>
            <FieldContent>
              <Input
                name="email"
                type="email"
                required
                placeholder="name@example.com"
                disabled={isPending}
                className="h-12 rounded-xl border-border bg-white transition-all focus-visible:border-primary/50 focus-visible:ring-primary/20"
              />
            </FieldContent>
            <FieldError errors={getErrors("email")} />
          </Field>

          <Field className="relative">
            <div className="mb-1 flex items-center justify-between">
              <FieldLabel className="text-sm font-medium text-foreground/80">Password</FieldLabel>
              <Link href="/foget-password" className="text-xs font-bold text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <FieldContent>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="********"
                  disabled={isPending}
                  className="h-12 rounded-xl border-border bg-white pr-12 transition-all focus-visible:border-primary/50 focus-visible:ring-primary/20"
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
            <FieldError errors={getErrors("password")} />
          </Field>
        </FieldGroup>

        <Button
          type="submit"
          className="group mt-2 h-12 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.99] disabled:opacity-70"
          disabled={isPending}
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
              Signing in...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Login
              <LucideArrowRight className="transition-transform group-hover:translate-x-1" size={18} />
            </span>
          )}
        </Button>
      </form>
    </>
  );
}
