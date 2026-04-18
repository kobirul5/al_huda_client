"use client";

import { useState, useCallback } from "react";

export interface BookmarkedSurah {
  id: number;
  name: string;
  transliteration: string;
  total_verses: number;
}

const BOOKMARK_KEY = "surah-bookmarks";

function getBookmarks(): BookmarkedSurah[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(BOOKMARK_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useBookmark(surah: BookmarkedSurah | null) {
  const [bookmarks, setBookmarks] = useState<BookmarkedSurah[]>(getBookmarks);
  const [isBookmarked, setIsBookmarked] = useState(
    () => surah !== null && getBookmarks().some((b) => b.id === surah.id)
  );

  const toggleBookmark = useCallback(() => {
    if (!surah) return;

    setBookmarks((prev) => {
      let updated: BookmarkedSurah[];
      const exists = prev.some((b) => b.id === surah.id);

      if (exists) {
        updated = prev.filter((b) => b.id !== surah.id);
        setIsBookmarked(false);
      } else {
        updated = [surah, ...prev];
        setIsBookmarked(true);
      }

      localStorage.setItem(BOOKMARK_KEY, JSON.stringify(updated));
      return updated;
    });
  }, [surah]);

  return { isBookmarked, toggleBookmark, bookmarks };
}

export function useAllBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkedSurah[]>(getBookmarks);

  const removeBookmark = useCallback((id: number) => {
    setBookmarks((prev) => {
      const updated = prev.filter((b) => b.id !== id);
      localStorage.setItem(BOOKMARK_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return { bookmarks, removeBookmark };
}
