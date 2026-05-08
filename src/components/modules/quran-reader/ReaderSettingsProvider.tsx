"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ReaderSettings } from "@/components/modules/surah/VerseCard";

const STORAGE_KEY = "surah-reader-settings";

const defaultSettings: ReaderSettings = {
  arabicFont: "amiri",
  arabicFontSize: 30,
  translationFontSize: 17,
  translationLanguage: "en",
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const getInitialSettings = (): ReaderSettings => {
  if (typeof window === "undefined") {
    return defaultSettings;
  }

  const rawSettings = window.localStorage.getItem(STORAGE_KEY);
  if (!rawSettings) {
    return defaultSettings;
  }

  try {
    const parsed = JSON.parse(rawSettings) as Partial<ReaderSettings>;
    return {
      arabicFont: parsed.arabicFont === "notoNaskh" ? "notoNaskh" : "amiri",
      arabicFontSize: clamp(parsed.arabicFontSize ?? defaultSettings.arabicFontSize, 24, 48),
      translationFontSize: clamp(parsed.translationFontSize ?? defaultSettings.translationFontSize, 14, 24),
      translationLanguage: parsed.translationLanguage === "bn" ? "bn" : "en",
    };
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return defaultSettings;
  }
};

const ReaderSettingsContext = createContext<{
  settings: ReaderSettings;
  setSettings: React.Dispatch<React.SetStateAction<ReaderSettings>>;
} | null>(null);

export function ReaderSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ReaderSettings>(getInitialSettings);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  return (
    <ReaderSettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </ReaderSettingsContext.Provider>
  );
}

export function useReaderSettings() {
  const context = useContext(ReaderSettingsContext);

  if (!context) {
    throw new Error("useReaderSettings must be used inside ReaderSettingsProvider");
  }

  return context;
}
