"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import VerseCard from "@/components/modules/surah/VerseCard";
import { useReaderSettings } from "./ReaderSettingsProvider";
import { Verse } from "./types";

interface ReaderContentProps {
  title: string;
  subtitle: string;
  verses: Verse[];
  emptyMessage?: string;
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
  previous,
  next,
}: ReaderContentProps) {
  const { settings } = useReaderSettings();

  return (
    <section className="mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-8">
      <div className="mb-8 grid grid-cols-1 items-center gap-4 md:mb-10 md:grid-cols-[120px_minmax(0,1fr)_120px]">
        <div className="hidden opacity-20 md:block">
          <BookOpen className="h-20 w-20 text-muted-foreground" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className="hidden md:block" />
      </div>

      <div className="divide-y divide-border border-y border-border">
        {verses.length > 0 ? (
          verses.map((verse) => (
            <VerseCard
              key={`${verse.surahId ?? "surah"}-${verse.id}`}
              verse={verse}
              settings={settings}
            />
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
