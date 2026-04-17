import LoginForm from "@/components/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fcf8_0%,#eef7f0_100%)] px-4 py-10 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-xl items-center justify-center">
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
                  Login
                </p>
                <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Welcome back</h1>
                <p className="text-sm text-muted-foreground">
                  Use your account credentials below.
                </p>
              </div>
            </div>

            <LoginForm
              quickLoginUser={{ email: "kobirul7k@gmail.com", password: "123456789" }}
            />

            <div className="border-t border-border pt-5">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="font-semibold text-primary hover:underline">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
