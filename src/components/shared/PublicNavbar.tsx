"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Bookmark,
  ChevronDown,
  Copyright,
  FolderKanban,
  Info,
  MessageCircle,
  MessageSquare,
  Shield,
  UserCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type NavbarUser = {
  email?: string;
  profileImage?: string | null;
} | null;

export default function Navbar({ user }: { user: NavbarUser }) {
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/#surahs", label: "Read Quran" },
    { href: "/prayer-time", label: "Prayer Time" },
    { href: "/ramadan-2026", label: "Ramadan 2026" },
  ];

  const otherLinks = [
    { href: "/blog", label: "Blog", icon: MessageSquare },
    { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
    { href: "/about-us", label: "About Us", icon: Info },
    { href: "/copyright", label: "Copyright", icon: Copyright },
    { href: "/contact-us", label: "Contact Us", icon: MessageCircle },
    { href: "/thanks-credits", label: "Thanks & Credits", icon: MessageSquare },
    { href: "/privacy-policy", label: "Privacy Policy", icon: Shield },
    { href: "/our-projects", label: "Our Projects", icon: FolderKanban },
  ];

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

        {/* Center: Nav */}
        <nav className="hidden items-center justify-center gap-1 lg:flex">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary"
            >
              {item.label}
            </Link>
          ))}

          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary"
            >
              <span>Others</span>
              <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
            </button>

            <div className="invisible absolute left-1/2 top-full grid w-[386px] -translate-x-1/2 grid-cols-2 gap-x-8 gap-y-1 rounded-xl border bg-background p-4 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-2 group-hover:opacity-100">
              {otherLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
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
