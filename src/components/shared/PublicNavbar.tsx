"use client";

import Link from "next/link";
import Image from "next/image";
import { UserCircle, Home, Bookmark, Book } from "lucide-react";

import { Button } from "@/components/ui/button";

type NavbarUser = {
  email?: string;
  profileImage?: string | null;
} | null;

export default function Navbar({ user }: { user: NavbarUser }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur">
      <div className="container mx-auto flex min-h-16 items-center justify-between px-4 py-3">
        {/* Left: Logo */}
        <div className="flex flex-1 items-center justify-start">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/assets/logo.png" alt="Al-Huda Logo" width={100} height={40} className="h-10 w-auto" />
            <span className="text-lg font-semibold text-primary hidden sm:inline-block">Al-Huda</span>
          </Link>
        </div>

        {/* Center: Nav Icons */}
        <nav className="flex items-center justify-center gap-1">
          <Link href="/" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary">
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <Link href="/bookmarks" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary">
            <Bookmark className="h-4 w-4" />
            <span>Bookmarks</span>
          </Link>
          <Link href="/hadith" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary">
            <Book className="h-4 w-4" />
            <span>Hadith</span>
          </Link>
        </nav>

        {/* Right: Auth / Profile */}
        <div className="flex flex-1 items-center justify-end gap-3 sm:gap-4">
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
            <Link href="/profile" className="flex items-center gap-3 rounded-full border border-primary/15 bg-primary/5 px-1 py-1 transition hover:bg-primary/10">
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
        </div>
      </div>
    </header>
  );
}
