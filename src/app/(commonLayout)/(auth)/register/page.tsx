import RegistrationForm from "@/components/registration-form";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fcf8_0%,#eef7f0_100%)] px-4 py-10 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl items-center justify-center">
        <div className="w-full rounded-[2rem] border border-primary/10 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(24,78,48,0.3)] sm:p-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <Link
                href="/"
                className="inline-flex w-fit rounded-full border border-primary/15 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
              >
                Back to home
              </Link>

              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary/70">
                  Register
                </p>
                <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
                  Create your account
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter your details below to open a new account.
                </p>
              </div>
            </div>

            <RegistrationForm />

            <div className="border-t border-border pt-5">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
