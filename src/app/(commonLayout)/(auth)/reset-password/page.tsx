"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LucideArrowRight, LucideCheckCircle2, LucideLock } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/services/auth/forgot-password";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const email =
    typeof window === "undefined" ? "" : (sessionStorage.getItem("resetEmail") ?? "");

  useEffect(() => {
    if (!email) {
      router.push("/foget-password");
    }
  }, [email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    const res = await resetPassword({ email, password });

    if (res.success) {
      setSuccess(true);
      sessionStorage.removeItem("resetEmail");
      sessionStorage.removeItem("otpType");
      toast.success("Password reset successfully!", {
        description: "Your password has been updated.",
      });
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      setError(res.message || "Failed to reset password");
      toast.error("Failed to reset password", {
        description: res.message || "Please try again.",
      });
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md overflow-hidden border-primary/10 p-12 text-center shadow-2xl">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <LucideCheckCircle2 className="text-green-600 dark:text-green-400" size={48} />
          </div>
          <CardTitle className="mb-4 text-3xl font-bold">Password Reset!</CardTitle>
          <CardDescription className="text-lg">
            Your password has been successfully updated. Redirecting to login...
          </CardDescription>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="relative w-full max-w-md overflow-hidden border-primary/10 shadow-2xl">
        <div className="pointer-events-none absolute top-0 right-0 p-8 opacity-5">
          <LucideLock size={120} />
        </div>

        <CardHeader className="space-y-3 pb-6">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <LucideLock className="text-primary" size={24} />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
            Reset Password
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Set a strong password to secure your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">New Password</label>
                <Input
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 bg-muted/30 border-muted-foreground/20 focus:bg-background transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm Password</label>
                <Input
                  type="password"
                  placeholder="********"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="h-12 bg-muted/30 border-muted-foreground/20 focus:bg-background transition-all"
                />
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="h-12 w-full text-base font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
              disabled={loading || password.length < 6}
            >
              {loading ? "Resetting..." : "Reset Password"}
              <LucideArrowRight className="ml-2" size={18} />
            </Button>
          </form>
        </CardContent>

        <div className="h-1 bg-linear-to-r from-primary/50 via-primary to-primary/50" />
      </Card>
    </div>
  );
}
