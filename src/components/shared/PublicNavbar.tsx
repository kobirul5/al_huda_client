"use client";

import Link from "next/link";
import Image from "next/image";
import { UserCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

type NavbarUser = {
  email?: string;
  profileImage?: string | null;
} | null;

export default function Navbar({ user }: { user: NavbarUser }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur">
      <div className="container mx-auto flex min-h-16 flex-wrap items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/assets/logo.png" alt="Al-Huda Logo" width={100} height={40} className="h-10 w-auto" />
          <span className="text-lg font-semibold text-primary">Al-Huda</span>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-4">
          <Link href="/" className="text-sm font-medium text-foreground transition-colors hover:text-primary">
            Home
          </Link>
          {!user ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Join Now</Link>
              </Button>
            </>
          ) : (
            <Link href="/profile" className="flex items-center gap-3 rounded-full border border-primary/15 bg-primary/5 px-3 py-2 transition hover:bg-primary/10">
              {user.profileImage ? (
                <Image
                  src={user.profileImage}
                  alt={user.email || "Profile"}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <UserCircle className="h-6 w-6 text-primary" />
              )}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
