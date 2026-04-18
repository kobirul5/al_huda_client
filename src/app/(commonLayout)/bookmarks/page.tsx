"use client";

import React from "react";
import Link from "next/link";
import { Bookmark, BookOpen, Trash2 } from "lucide-react";
import { useAllBookmarks } from "@/hooks/useBookmark";

export default function BookmarksPage() {
  const { bookmarks, removeBookmark } = useAllBookmarks();

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen">
      <div className="mb-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Bookmark className="h-8 w-8 text-primary fill-primary/20" />
          <h1 className="text-4xl font-extrabold text-slate-900">My Bookmarks</h1>
        </div>
        <p className="text-muted-foreground">
          Your saved Surahs — continue reading from where you left off.
        </p>
        <div className="mt-4 h-1.5 w-24 rounded-full bg-primary mx-auto" />
      </div>

      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground">
          <BookOpen className="h-16 w-16 opacity-20" />
          <p className="text-xl font-medium">No bookmarks yet.</p>
          <p className="text-sm">Open any Surah and click the Bookmark button to save it here.</p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-primary/90 transition-colors"
          >
            Browse Surahs
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map((surah) => (
            <div
              key={surah.id}
              className="group flex items-center justify-between gap-4 rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition-all"
            >
              <Link
                href={`/surah/${surah.id}`}
                className="flex items-center gap-4 flex-1 min-w-0"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
                  {surah.id}
                </span>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 truncate">{surah.transliteration}</p>
                  <p className="text-sm text-muted-foreground">{surah.name} · {surah.total_verses} Verses</p>
                </div>
              </Link>

              <button
                onClick={() => removeBookmark(surah.id)}
                title="Remove bookmark"
                className="shrink-0 flex items-center justify-center h-9 w-9 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
