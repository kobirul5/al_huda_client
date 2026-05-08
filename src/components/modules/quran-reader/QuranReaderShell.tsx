"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Bookmark,
  Compass,
  Grid2X2,
  Heart,
  Home,
  Leaf,
  Menu,
  Search,
  X,
} from "lucide-react";
import { arabicFontFamilyMap } from "@/components/modules/surah/VerseCard";
import { ReaderSettingsProvider } from "./ReaderSettingsProvider";
import ReaderSettingsPanel from "./ReaderSettingsPanel";
import { ReaderTab, SurahListItem } from "./types";

const railLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/#surahs", label: "Surahs", icon: Grid2X2 },
  { href: "/prayer-time", label: "Prayer Time", icon: Compass },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: "/hadith", label: "Hadith", icon: BookOpen },
];

const juzItems = Array.from({ length: 30 }, (_, index) => ({
  id: index + 1,
  label: `Juz ${index + 1}`,
}));

function getActiveTab(pathname: string): ReaderTab {
  if (pathname.startsWith("/juz")) {
    return "juz";
  }

  if (pathname.startsWith("/page")) {
    return "page";
  }

  return "surah";
}

function ReaderNavigation({
  surahs,
  onNavigate,
}: {
  surahs: SurahListItem[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const activeTab = getActiveTab(pathname);
  const [search, setSearch] = useState("");

  const filteredSurahs = useMemo(() => {
    const normalizedQuery = search.trim().toLocaleLowerCase();

    if (!normalizedQuery) {
      return surahs;
    }

    return surahs.filter((item) =>
      [item.name, item.transliteration, String(item.id)]
        .filter(Boolean)
        .some((value) => value.toLocaleLowerCase().includes(normalizedQuery))
    );
  }, [search, surahs]);

  const filteredJuz = useMemo(() => {
    const normalizedQuery = search.trim().toLocaleLowerCase();

    if (!normalizedQuery) {
      return juzItems;
    }

    return juzItems.filter((item) =>
      [item.label, String(item.id), `para ${item.id}`].some((value) =>
        value.toLocaleLowerCase().includes(normalizedQuery)
      )
    );
  }, [search]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-4 grid grid-cols-3 rounded-full bg-card p-1">
        {(["surah", "juz", "page"] as ReaderTab[]).map((item) => (
          <Link
            key={item}
            href={item === "surah" ? "/surah/1" : item === "juz" ? "/juz/1" : "/page/1"}
            onClick={onNavigate}
            className={`rounded-full px-4 py-2 text-center text-sm font-semibold capitalize transition ${
              activeTab === item ? "bg-background text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {item}
          </Link>
        ))}
      </div>

      <div className="mb-4 flex items-center gap-3 rounded-full border border-border bg-card px-4 py-3 text-muted-foreground">
        <Search className="h-4 w-4" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={activeTab === "juz" ? "Search Juz" : activeTab === "page" ? "Search Page" : "Search Surah"}
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
        />
      </div>

      <div className="green-scrollbar min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {activeTab === "surah"
          ? filteredSurahs.map((item) => {
              const active = pathname === `/surah/${item.id}`;

              return (
                <Link
                  key={item.id}
                  href={`/surah/${item.id}`}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 rounded-xl border p-3 transition ${
                    active
                      ? "border-primary/40 bg-primary/10"
                      : "border-border bg-sidebar hover:border-primary/25 hover:bg-card"
                  }`}
                >
                  <span
                    className={`grid h-10 w-10 shrink-0 rotate-45 place-items-center rounded-lg ${
                      active ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"
                    }`}
                  >
                    <span className="-rotate-45 text-sm font-bold">{item.id}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-foreground">{item.transliteration}</span>
                    <span className="block truncate text-xs text-muted-foreground">{item.total_verses} Ayah</span>
                  </span>
                  <span
                    className="max-w-18 truncate text-right text-lg text-muted-foreground"
                    style={{ fontFamily: arabicFontFamilyMap.amiri }}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })
          : null}

        {activeTab === "juz"
          ? filteredJuz.map((item) => {
              const active = pathname === `/juz/${item.id}`;

              return (
                <Link
                  key={item.id}
                  href={`/juz/${item.id}`}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 rounded-xl border p-3 transition ${
                    active
                      ? "border-primary/40 bg-primary/10"
                      : "border-border bg-sidebar hover:border-primary/25 hover:bg-card"
                  }`}
                >
                  <span
                    className={`grid h-10 w-10 shrink-0 rotate-45 place-items-center rounded-lg ${
                      active ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"
                    }`}
                  >
                    <span className="-rotate-45 text-sm font-bold">{item.id}</span>
                  </span>
                  <span className="block truncate text-sm font-bold text-foreground">{item.label}</span>
                </Link>
              );
            })
          : null}

        {activeTab === "page" ? (
          <div className="rounded-xl border border-border bg-card px-4 py-5 text-sm text-muted-foreground">
            Page navigation will be available soon.
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function QuranReaderShell({
  surahs,
  children,
}: {
  surahs: SurahListItem[];
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <ReaderSettingsProvider>
      <div className="dark h-dvh overflow-hidden bg-background text-foreground">
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-16 border-r border-border bg-sidebar px-2 py-3 md:flex md:flex-col md:items-center">
          <Link href="/" className="mb-16 grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
            <BookOpen className="h-6 w-6" />
          </Link>

          <div className="flex flex-1 flex-col items-center justify-center gap-5">
            {railLinks.map((item) => {
              const Icon = item.icon;
              const active = item.href === "/#surahs";

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  className={`grid h-9 w-9 place-items-center rounded-xl transition ${
                    active ? "bg-accent/40 text-primary" : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              );
            })}
          </div>
        </aside>

        <div className="flex h-dvh flex-col md:pl-16">
          <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4">
            <div className="flex min-w-0 items-center gap-3">
              <button
                onClick={() => setMobileNavOpen(true)}
                className="grid h-9 w-9 place-items-center rounded-full bg-card text-foreground lg:hidden"
                title="Open reader navigation"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="min-w-0">
                <h1 className="truncate text-xl font-bold leading-5 text-foreground">Al Huda</h1>
                <p className="mt-1 truncate text-[11px] text-muted-foreground">Read, Study, and Learn The Quran</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="grid h-9 w-9 place-items-center rounded-full bg-card text-primary">
                <Leaf className="h-4 w-4" />
              </button>
              <button className="hidden items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground sm:flex">
                Support Us
                <Heart className="h-4 w-4 fill-primary-foreground" />
              </button>
            </div>
          </header>

          <div className="grid min-h-0 flex-1 lg:grid-cols-[334px_minmax(0,1fr)] xl:grid-cols-[334px_minmax(0,1fr)_342px]">
            <aside className="hidden min-h-0 border-r border-border bg-sidebar p-5 lg:block">
              <ReaderNavigation surahs={surahs} />
            </aside>

            <main className="green-scrollbar min-h-0 overflow-y-auto bg-background">{children}</main>

            <ReaderSettingsPanel />
          </div>
        </div>

        {mobileNavOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              className="absolute inset-0 bg-background/70"
              onClick={() => setMobileNavOpen(false)}
              aria-label="Close reader navigation"
            />
            <aside className="absolute inset-y-0 left-0 flex w-[min(88vw,360px)] flex-col border-r border-border bg-sidebar p-4 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-base font-bold text-foreground">Quran</span>
                <button
                  onClick={() => setMobileNavOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-full bg-card text-foreground"
                  title="Close reader navigation"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <ReaderNavigation surahs={surahs} onNavigate={() => setMobileNavOpen(false)} />
            </aside>
          </div>
        ) : null}
      </div>
    </ReaderSettingsProvider>
  );
}
