"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LucideArrowRight, LucideShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { verifyOtp } from "@/services/auth/forgot-password";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const email =
    typeof window === "undefined" ? "" : (sessionStorage.getItem("resetEmail") ?? "");
  const otpType =
    typeof window === "undefined" ? null : sessionStorage.getItem("otpType");

  useEffect(() => {
    if (!email || !otpType) {
      router.push("/foget-password");
    }
  }, [email, otpType, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email is missing. Please try logging in again.");
      return;
    }

    setLoading(true);
    setError("");

    const res = await verifyOtp(email, otp);

    if (res.success) {
      const currentOtpType = sessionStorage.getItem("otpType");

      if (currentOtpType === "verify") {
        sessionStorage.removeItem("resetEmail");
        sessionStorage.removeItem("otpType");
        toast.success("Email verified successfully!");
        router.push("/");
      } else {
        toast.success("Code verified successfully!", {
          description: "You can now reset your password.",
        });
        router.push("/reset-password");
      }
    } else {
      setError(res.message || "Invalid OTP or expired");
      toast.error("Verification failed", {
        description: res.message || "Invalid OTP or expired",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="relative w-full max-w-md overflow-hidden border-primary/10 shadow-2xl">
        <div className="pointer-events-none absolute top-0 right-0 p-8 opacity-5">
          <LucideShieldCheck size={120} />
        </div>

        <CardHeader className="space-y-3 pb-6">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <LucideShieldCheck className="text-primary" size={24} />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
            Verify OTP
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Enter the 4-digit code sent to{" "}
            <span suppressHydrationWarning className="font-semibold uppercase text-foreground">
              {email}
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="0 0 0 0"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                required
                className="h-16 bg-muted/30 text-center font-mono text-3xl tracking-[0.5em] transition-all focus:bg-background border-muted-foreground/20"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-destructive/10 p-3 text-sm font-medium text-destructive">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="h-12 w-full text-base font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
              disabled={loading || otp.length < 4}
            >
              {loading ? "Verifying..." : "Verify Code"}
              <LucideArrowRight className="ml-2" size={18} />
            </Button>
          </form>

          <div className="pt-2 text-center">
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive code?{" "}
              <button type="button" className="font-medium text-primary hover:underline">
                Resend
              </button>
            </p>
          </div>
        </CardContent>

        <div className="h-1 bg-linear-to-r from-primary/50 via-primary to-primary/50" />
      </Card>
    </div>
  );
}
