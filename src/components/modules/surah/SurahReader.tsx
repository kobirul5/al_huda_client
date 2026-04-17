"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import VerseCard, { arabicFontFamilyMap, ReaderSettings } from "@/components/modules/surah/VerseCard";

interface Verse {
  id: number;
  text: string;
  translation: string;
  transliteration: string;
}

interface SurahData {
  id: number;
  name: string;
  transliteration: string;
  type: string;
  total_verses: number;
  verses: Verse[];
}

interface SurahReaderProps {
  surah: SurahData;
}

const STORAGE_KEY = "surah-reader-settings";

const defaultSettings: ReaderSettings = {
  arabicFont: "amiri",
  arabicFontSize: 36,
  translationFontSize: 18,
  translationLanguage: "en",
};

const arabicFontOptions: Array<{
  value: ReaderSettings["arabicFont"];
  label: string;
}> = [
  { value: "amiri", label: "Amiri" },
  { value: "notoNaskh", label: "Noto Naskh Arabic" },
];

const translationLanguageOptions: Array<{
  value: ReaderSettings["translationLanguage"];
  label: string;
}> = [
  { value: "en", label: "English Translation" },
  { value: "bn", label: "Bangla Translation" },
];

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
      arabicFontSize: clamp(parsed.arabicFontSize ?? defaultSettings.arabicFontSize, 28, 56),
      translationFontSize: clamp(parsed.translationFontSize ?? defaultSettings.translationFontSize, 14, 28),
      translationLanguage: parsed.translationLanguage === "bn" ? "bn" : "en",
    };
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return defaultSettings;
  }
};

export default function SurahReader({ surah }: SurahReaderProps) {
  const [settings, setSettings] = useState<ReaderSettings>(getInitialSettings);
  const [surahDetail, setSurahDetail] = useState<SurahData>(surah);
  const [isTranslationLoading, setIsTranslationLoading] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    setSurahDetail(surah);
  }, [surah]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadSurah = async () => {
      setIsTranslationLoading(true);

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
        const response = await fetch(
          `${apiUrl}/quran/surahs/${surah.id}?translation=${settings.translationLanguage}`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch translated surah");
        }

        const json = await response.json();
        if (isMounted) {
          setSurahDetail(json.data as SurahData);
        }
      } catch (error) {
        if ((error as Error).name !== "AbortError" && isMounted) {
          setSurahDetail(surah);
        }
      } finally {
        if (isMounted) {
          setIsTranslationLoading(false);
        }
      }
    };

    loadSurah();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [settings.translationLanguage, surah]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <section className="relative pt-10 pb-16 px-6 text-center overflow-hidden bg-[#0F172A]">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[50%] h-full bg-primary rounded-full blur-[150px]" />
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-xl mb-6 shadow-glow">
              {surahDetail.id}
            </div>
            <h1
              className="text-6xl md:text-7xl font-bold text-white mb-4 tracking-tight"
              style={{ fontFamily: arabicFontFamilyMap[settings.arabicFont] }}
            >
              {surahDetail.name}
            </h1>
            <p className="text-xl text-slate-400 font-medium mb-8">
              {surahDetail.transliteration} - {surahDetail.type}
            </p>

            <div className="flex gap-4">
              <span className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white text-sm font-bold">
                {surahDetail.total_verses} Verses
              </span>
            </div>

            <div className="w-full mt-5">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-primary transition-colors mb-10 group"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="group-hover:-translate-x-1 transition-transform">
                  <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-330 mx-auto px-4 -mt-10 relative z-10">
        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] items-start">
          <aside className="h-fit rounded-3xl border border-border bg-card p-6 shadow-lg lg:sticky lg:top-24">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary/80 mb-2">Reader Settings</p>
              <h2 className="text-2xl font-bold text-foreground">Settings Panel</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Adjust the Arabic font and text size to your preference. Your settings will be saved in the browser.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label htmlFor="translation-language" className="text-sm font-semibold text-foreground">
                  Translation Language
                </label>
                <select
                  id="translation-language"
                  value={settings.translationLanguage}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      translationLanguage: event.target.value as ReaderSettings["translationLanguage"],
                    }))
                  }
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
                >
                  {translationLanguageOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
               
              </div>

              <div className="space-y-3">
                <label htmlFor="arabic-font" className="text-sm font-semibold text-foreground">
                  Arabic Font Selection
                </label>
                <select
                  id="arabic-font"
                  value={settings.arabicFont}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      arabicFont: event.target.value as ReaderSettings["arabicFont"],
                    }))
                  }
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
                >
                  {arabicFontOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <label htmlFor="arabic-font-size" className="text-sm font-semibold text-foreground">
                    Arabic Font Size
                  </label>
                  <span className="text-sm font-bold text-primary">{settings.arabicFontSize}px</span>
                </div>
                <input
                  id="arabic-font-size"
                  type="range"
                  min="28"
                  max="56"
                  step="2"
                  value={settings.arabicFontSize}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      arabicFontSize: Number(event.target.value),
                    }))
                  }
                  className="w-full accent-primary"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <label htmlFor="translation-font-size" className="text-sm font-semibold text-foreground">
                    Translation Font Size
                  </label>
                  <span className="text-sm font-bold text-primary">{settings.translationFontSize}px</span>
                </div>
                <input
                  id="translation-font-size"
                  type="range"
                  min="14"
                  max="28"
                  step="1"
                  value={settings.translationFontSize}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      translationFontSize: Number(event.target.value),
                    }))
                  }
                  className="w-full accent-primary"
                />
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            {surahDetail.verses.map((verse) => (
              <VerseCard key={verse.id} verse={verse} settings={settings} />
            ))}

            <div className="mt-16 flex justify-between items-center bg-card border border-border p-6 rounded-3xl shadow-lg">
              <Link
                href={surahDetail.id > 1 ? `/surah/${surahDetail.id - 1}` : "/"}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all ${
                  surahDetail.id > 1 ? "bg-muted text-foreground hover:bg-primary hover:text-white" : "opacity-0 pointer-events-none"
                }`}
              >
                Previous Surah
              </Link>

              <Link
                href={surahDetail.id < 114 ? `/surah/${surahDetail.id + 1}` : "/"}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all ${
                  surahDetail.id < 114 ? "bg-primary text-white hover:shadow-glow" : "opacity-0 pointer-events-none"
                }`}
              >
                Next Surah
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
