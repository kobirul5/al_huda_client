"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import {
  Bookmark,
  ChevronDown,
  Copyright,
  FolderKanban,
  Info,
  Menu,
  MessageCircle,
  MessageSquare,
  Moon,
  Shield,
  Sun,
  UserCircle,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavbarUser = {
  email?: string;
  profileImage?: string | null;
} | null;

function subscribeToClientMount() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export default function Navbar({ user }: { user: NavbarUser }) {
  const pathname = usePathname();
  const mounted = useSyncExternalStore(subscribeToClientMount, getClientSnapshot, getServerSnapshot);
  const [menuState, setMenuState] = useState({ isOpen: false, pathname });
  const { theme, setTheme } = useTheme();
  const isMenuOpen = menuState.isOpen && menuState.pathname === pathname;

  if (pathname.startsWith("/surah/")) {
    return null;
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/surah/1", label: "Read Quran" },
    { href: "/prayer-time", label: "Prayer Time" },
    { href: "/ramadan", label: "Ramadan 2026" },
    { href: "/ask-alhuda", label: "Al-Huda AI" },
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex min-h-16 items-center justify-between px-4 py-3">
        {/* Left: Logo & Hamburger */}
        <div className="flex flex-1 items-center justify-start gap-4">
          <button
            type="button"
            className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-primary transition-colors"
            onClick={() => setMenuState({ isOpen: !isMenuOpen, pathname })}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <Link href="/" className="flex items-center gap-2">
            <Image src="/assets/logo.png" alt="Al-Huda Logo" width={100} height={40} className="h-10 w-auto" />
            <span className="text-lg font-semibold text-primary hidden sm:inline-block">Al-Huda</span>
          </Link>
        </div>

        {/* Center: Nav (Desktop) */}
        <nav className="hidden items-center justify-center gap-1 lg:flex">
          {navLinks.map((item) => {
             const isActive = pathname === item.href;
             return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/5 hover:text-primary",
                  isActive ? "text-primary bg-primary/5" : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
             );
          })}

          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary"
            >
              <span>Others</span>
              <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
            </button>

            <div className="invisible absolute left-1/2 top-full grid w-96.5 -translate-x-1/2 grid-cols-2 gap-x-8 gap-y-1 rounded-xl border bg-background p-4 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-2 group-hover:opacity-100">
              {otherLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuState({ isOpen: false, pathname })}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-primary/5 hover:text-primary",
                      isActive ? "text-primary bg-primary/5" : "text-muted-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Right: Auth / Profile / Theme */}
        <div className="flex flex-1 items-center justify-end gap-3 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
            title="Toggle theme"
          >
            {mounted ? (
              <>
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </>
            ) : (
              <Sun className="h-5 w-5 animate-pulse" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          {!user ? (
            <>
              <Button variant="ghost" asChild className="hidden sm:inline-flex">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="hidden sm:inline-flex">
                <Link href="/register">Join Now</Link>
              </Button>
              <Button size="icon" variant="ghost" asChild className="sm:hidden rounded-full">
                 <Link href="/login"><UserCircle className="h-5 w-5" /></Link>
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

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="absolute inset-x-0 top-full z-50 h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border bg-background shadow-2xl lg:hidden">
          <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-3 mb-2">Main Menu</h3>
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold transition-all",
                      isActive 
                        ? "bg-primary/10 text-primary border border-primary/20" 
                        : "text-foreground hover:bg-primary/5 hover:text-primary"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-3 mb-2">Others</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {otherLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuState({ isOpen: false, pathname })}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                        isActive 
                          ? "bg-primary/10 text-primary border border-primary/20" 
                          : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {!user && (
              <div className="flex flex-col gap-3 mt-4 pt-6 border-t border-border sm:hidden">
                <Button variant="outline" asChild className="w-full justify-center rounded-xl h-12">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="w-full justify-center rounded-xl h-12">
                  <Link href="/register">Join Now</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
