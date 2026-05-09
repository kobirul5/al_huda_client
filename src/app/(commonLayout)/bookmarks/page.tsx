"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bookmark, BookOpen, Trash2, LayoutGrid, List } from "lucide-react";
import { useAllBookmarks } from "@/hooks/useBookmark";
import { useAllVerseBookmarks } from "@/hooks/useVerseBookmark";
import { cn } from "@/lib/utils";

type BookmarkTab = "surahs" | "verses";

export default function BookmarksPage() {
  const [activeTab, setActiveTab] = useState<BookmarkTab>("surahs");
  const { bookmarks: surahBookmarks, removeBookmark: removeSurahBookmark } = useAllBookmarks();
  const { bookmarks: verseBookmarks, removeBookmark: removeVerseBookmark } = useAllVerseBookmarks();

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen">
      <div className="mb-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Bookmark className="h-8 w-8 text-primary fill-primary/20" />
          <h1 className="text-4xl font-extrabold text-foreground">My Bookmarks</h1>
        </div>
        <p className="text-muted-foreground">
          Your saved Quranic content — continue your journey from where you left off.
        </p>
        <div className="mt-4 h-1.5 w-24 rounded-full bg-primary mx-auto" />
      </div>

      {/* Tab Switcher */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex p-1 bg-muted rounded-xl">
          <button
            onClick={() => setActiveTab("surahs")}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all",
              activeTab === "surahs" 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
            Surahs ({surahBookmarks.length})
          </button>
          <button
            onClick={() => setActiveTab("verses")}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all",
              activeTab === "verses" 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <List className="h-4 w-4" />
            Verses ({verseBookmarks.length})
          </button>
        </div>
      </div>

      {activeTab === "surahs" ? (
        surahBookmarks.length === 0 ? (
          <EmptyState 
            message="No bookmarked Surahs yet." 
            description="Open any Surah and click the bookmark icon to save it here." 
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {surahBookmarks.map((surah) => (
              <div
                key={surah.id}
                className="group flex items-center justify-between gap-4 rounded-2xl border bg-card p-5 shadow-sm hover:shadow-md transition-all"
              >
                <Link
                  href={`/surah/${surah.id}`}
                  className="flex items-center gap-4 flex-1 min-w-0"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
                    {surah.id}
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold text-foreground truncate">{surah.transliteration}</p>
                    <p className="text-sm text-muted-foreground">{surah.name} · {surah.total_verses} Verses</p>
                  </div>
                </Link>

                <button
                  onClick={() => removeSurahBookmark(surah.id)}
                  title="Remove bookmark"
                  className="shrink-0 flex items-center justify-center h-9 w-9 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )
      ) : (
        verseBookmarks.length === 0 ? (
          <EmptyState 
            message="No bookmarked Verses yet." 
            description="Click the bookmark icon on any Ayah to save it here for quick access." 
          />
        ) : (
          <div className="grid gap-6">
            {verseBookmarks.map((verse) => (
              <div
                key={`${verse.surahId}-${verse.id}`}
                className="group relative rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <Link
                    href={`/surah/${verse.surahId}#surah-${verse.surahId}-ayah-${verse.id}`}
                    className="flex items-center gap-3"
                  >
                    <span className="text-sm font-bold text-primary">
                      {verse.surahName} {verse.surahId}:{verse.id}
                    </span>
                  </Link>
                  <button
                    onClick={() => removeVerseBookmark(verse.surahId!, verse.id)}
                    className="h-8 w-8 flex items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <p className="text-right text-2xl mb-4 leading-loose font-arabic text-foreground" style={{ fontFamily: "var(--font-arabic-amiri)" }}>
                  {verse.text}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {verse.translation}
                </p>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

function EmptyState({ message, description }: { message: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground">
      <BookOpen className="h-16 w-16 opacity-20" />
      <p className="text-xl font-medium">{message}</p>
      <p className="text-sm">{description}</p>
      <Link
        href="/"
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-primary/90 transition-colors"
      >
        Browse Surahs
      </Link>
    </div>
  );
}
