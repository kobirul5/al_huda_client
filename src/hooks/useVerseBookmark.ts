"use client";

import { useState, useCallback, useEffect } from "react";
import { Verse } from "@/components/modules/quran-reader/types";

export interface BookmarkedVerse extends Verse {
  bookmarkedAt: number;
}

const VERSE_BOOKMARK_KEY = "verse-bookmarks";

function getVerseBookmarks(): BookmarkedVerse[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(VERSE_BOOKMARK_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useVerseBookmark(verse: Verse | null) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const checkStatus = useCallback(() => {
    if (!verse) return;
    const bookmarks = getVerseBookmarks();
    const exists = bookmarks.some(
      (b) => b.id === verse.id && b.surahId === verse.surahId
    );
    setIsBookmarked(exists);
  }, [verse]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const toggleBookmark = useCallback(() => {
    if (!verse || !verse.surahId) return;

    const bookmarks = getVerseBookmarks();
    const verseKey = { id: verse.id, surahId: verse.surahId };
    const exists = bookmarks.some(
      (b) => b.id === verseKey.id && b.surahId === verseKey.surahId
    );

    let updated: BookmarkedVerse[];
    if (exists) {
      updated = bookmarks.filter(
        (b) => !(b.id === verseKey.id && b.surahId === verseKey.surahId)
      );
      setIsBookmarked(false);
    } else {
      const newBookmark: BookmarkedVerse = {
        ...verse,
        surahId: verse.surahId, // Ensure it's present
        bookmarkedAt: Date.now(),
      };
      updated = [newBookmark, ...bookmarks];
      setIsBookmarked(true);
    }

    localStorage.setItem(VERSE_BOOKMARK_KEY, JSON.stringify(updated));
    // Dispatch storage event for other components to sync
    window.dispatchEvent(new Event("storage"));
  }, [verse]);

  return { isBookmarked, toggleBookmark };
}

export function useAllVerseBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkedVerse[]>([]);

  const loadBookmarks = useCallback(() => {
    setBookmarks(getVerseBookmarks());
  }, []);

  useEffect(() => {
    loadBookmarks();
    const handleStorage = () => loadBookmarks();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [loadBookmarks]);

  const removeBookmark = useCallback((surahId: number, id: number) => {
    const current = getVerseBookmarks();
    const updated = current.filter((b) => !(b.id === id && b.surahId === surahId));
    localStorage.setItem(VERSE_BOOKMARK_KEY, JSON.stringify(updated));
    setBookmarks(updated);
    window.dispatchEvent(new Event("storage"));
  }, []);

  return { bookmarks, removeBookmark };
}
