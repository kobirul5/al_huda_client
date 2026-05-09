"use client";

import Link from "next/link";
import { Bookmark, BookOpen } from "lucide-react";
import VerseCard, { arabicFontFamilyMap } from "@/components/modules/surah/VerseCard";
import { useReaderSettings } from "./ReaderSettingsProvider";
import { Verse } from "./types";
import { useBookmark } from "@/hooks/useBookmark";
import { cn } from "@/lib/utils";

interface ReaderContentProps {
  title: string;
  subtitle: string;
  verses: Verse[];
  emptyMessage?: string;
  surahInfo?: {
    id: number;
    name: string;
    transliteration: string;
    total_verses: number;
  };
  previous?: {
    href: string;
    label: string;
  };
  next?: {
    href: string;
    label: string;
  };
}

export default function ReaderContent({
  title,
  subtitle,
  verses,
  emptyMessage = "No ayahs found",
  surahInfo,
  previous,
  next,
}: ReaderContentProps) {
  const { settings } = useReaderSettings();
  const { isBookmarked, toggleBookmark } = useBookmark(surahInfo ? {
    id: surahInfo.id,
    name: surahInfo.name,
    transliteration: surahInfo.transliteration,
    total_verses: surahInfo.total_verses
  } : null);

  return (
    <section className="mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-8">
      <div className="mb-8 grid grid-cols-1 items-center gap-4 md:mb-10 md:grid-cols-[120px_minmax(0,1fr)_120px]">
        <div className="hidden opacity-20 md:block">
          <BookOpen className="h-20 w-20 text-muted-foreground" />
        </div>
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            {surahInfo && (
              <button
                onClick={toggleBookmark}
                className={cn(
                  "p-2 rounded-full transition hover:bg-accent",
                  isBookmarked ? "text-primary" : "text-muted-foreground"
                )}
                title={isBookmarked ? "Remove Surah from bookmarks" : "Bookmark Surah"}
              >
                <Bookmark className={cn("h-6 w-6", isBookmarked && "fill-current")} />
              </button>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className="hidden md:block" />
      </div>

      <div className="divide-y divide-border border-y border-border">
        {verses.length > 0 ? (
          verses.map((verse) => (
            <div key={`${verse.surahId ?? "surah"}-${verse.id}`}>
              {verse.showSurahHeading ? (
                <div id={verse.headingAnchorId} className="scroll-mt-8 py-8 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">Surah</p>
                  <h3 className="mt-2 text-xl font-bold text-foreground">{verse.surahName}</h3>
                  {verse.surahArabicName ? (
                    <p
                      className="mt-3 text-3xl leading-relaxed text-foreground"
                      style={{ fontFamily: arabicFontFamilyMap[settings.arabicFont] }}
                    >
                      {verse.surahArabicName}
                    </p>
                  ) : null}
                </div>
              ) : null}
              <VerseCard verse={verse} settings={settings} playlist={verses} />
            </div>
          ))
        ) : (
          <div className="py-16 text-center">
            <h3 className="text-xl font-bold text-foreground">{emptyMessage}</h3>
            <p className="mt-2 text-sm text-muted-foreground">Try another word from the Arabic text or translation.</p>
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        {previous ? (
          <Link href={previous.href} className="rounded-full bg-card px-5 py-3 text-sm font-bold text-foreground transition hover:bg-accent">
            {previous.label}
          </Link>
        ) : (
          <span />
        )}

        {next ? (
          <Link href={next.href} className="rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary/90">
            {next.label}
          </Link>
        ) : (
          <span />
        )}
      </div>
    </section>
  );
}
