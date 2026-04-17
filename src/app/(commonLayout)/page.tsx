import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-4rem)] ">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_20px_60px_-40px_rgba(88,70,52,0.45)] backdrop-blur-md sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/70">
            Auth Access
          </p>
          <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Only the navbar and authentication flow remain in this project.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            The app now keeps just the public navbar plus login, register, forgot password,
            OTP verify, and reset password screens.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-full border border-primary/15 bg-primary/5 px-6 py-3 text-sm font-semibold text-primary transition-transform hover:-translate-y-0.5"
            >
              Register
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
