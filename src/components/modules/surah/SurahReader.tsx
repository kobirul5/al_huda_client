"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Bookmark,
  ChevronDown,
  Compass,
  Grid2X2,
  Heart,
  Home,
  Leaf,
  Menu,
  MoreHorizontal,
  Play,
  Search,
  Settings,
  Shield,
  SlidersHorizontal,
  Type,
} from "lucide-react";
import VerseCard, { arabicFontFamilyMap, ReaderSettings } from "@/components/modules/surah/VerseCard";
import { useBookmark } from "@/hooks/useBookmark";

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

interface SurahListItem {
  id: number;
  name: string;
  transliteration: string;
  type: string;
  total_verses: number;
}

interface ParaSurahSegment extends SurahListItem {
  start_ayah: number;
  end_ayah: number;
  verses: Verse[];
}

interface ParaData {
  id: number;
  start: {
    surah: number;
    ayah: number;
  };
  end: {
    surah: number;
    ayah: number;
  };
  total_surahs: number;
  total_verses: number;
  surahs: ParaSurahSegment[];
}

interface SurahReaderProps {
  surah: SurahData;
  surahs: SurahListItem[];
  initialParas?: ParaData[];
  initialParasLanguage?: ReaderSettings["translationLanguage"];
}

type ReaderTab = "Surah" | "Juz" | "Page";

const STORAGE_KEY = "surah-reader-settings";

const defaultSettings: ReaderSettings = {
  arabicFont: "amiri",
  arabicFontSize: 30,
  translationFontSize: 17,
  translationLanguage: "en",
};

const arabicFontOptions: Array<{
  value: ReaderSettings["arabicFont"];
  label: string;
}> = [
  { value: "amiri", label: "PDMS Islamic" },
  { value: "notoNaskh", label: "Noto Naskh Arabic" },
];

const translationLanguageOptions: Array<{
  value: ReaderSettings["translationLanguage"];
  label: string;
}> = [
  { value: "en", label: "English Translation" },
  { value: "bn", label: "Bangla Translation" },
];

const railLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/#surahs", label: "Surahs", icon: Grid2X2 },
  { href: "/prayer-time", label: "Prayer Time", icon: Compass },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: "/hadith", label: "Hadith", icon: BookOpen },
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
      arabicFontSize: clamp(parsed.arabicFontSize ?? defaultSettings.arabicFontSize, 24, 48),
      translationFontSize: clamp(parsed.translationFontSize ?? defaultSettings.translationFontSize, 14, 24),
      translationLanguage: parsed.translationLanguage === "bn" ? "bn" : "en",
    };
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return defaultSettings;
  }
};

function BookmarkButton({ surahDetail }: { surahDetail: SurahData }) {
  const { isBookmarked, toggleBookmark } = useBookmark({
    id: surahDetail.id,
    name: surahDetail.name,
    transliteration: surahDetail.transliteration,
    total_verses: surahDetail.total_verses,
  });

  return (
    <button
      onClick={toggleBookmark}
      title={isBookmarked ? "Remove Bookmark" : "Bookmark this Surah"}
      className="grid h-9 w-9 place-items-center rounded-full bg-card text-muted-foreground transition hover:bg-accent hover:text-primary"
    >
      <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-primary text-primary" : ""}`} />
    </button>
  );
}

export default function SurahReader({
  surah,
  surahs,
  initialParas = [],
  initialParasLanguage = "en",
}: SurahReaderProps) {
  const [settings, setSettings] = useState<ReaderSettings>(getInitialSettings);
  const [surahDetail, setSurahDetail] = useState<SurahData>(surah);
  const [selectedPara, setSelectedPara] = useState<ParaData | null>(null);
  const [paras, setParas] = useState<ParaData[]>(initialParas);
  const [parasLanguage, setParasLanguage] = useState<ReaderSettings["translationLanguage"]>(initialParasLanguage);
  const [activeTab, setActiveTab] = useState<ReaderTab>("Surah");
  const [searchQuery, setSearchQuery] = useState("");
  const [surahSearch, setSurahSearch] = useState("");
  const [isTranslationLoading, setIsTranslationLoading] = useState(false);
  const [isParaLoading, setIsParaLoading] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    setSurahDetail(surah);
  }, [surah]);

  useEffect(() => {
    setSearchQuery("");
  }, [surah.id, settings.translationLanguage, selectedPara?.id]);

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

  useEffect(() => {
    if (activeTab !== "Juz") {
      return;
    }

    if (paras.length > 0 && parasLanguage === settings.translationLanguage) {
      setSelectedPara((current) => current ?? paras[0] ?? null);
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    const loadParas = async () => {
      setIsParaLoading(true);

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
        const response = await fetch(
          `${apiUrl}/quran/paras?translation=${settings.translationLanguage}`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch paras");
        }

        const json = await response.json();
        const loadedParas = json.data as ParaData[];

        if (isMounted) {
          setParas(loadedParas);
          setParasLanguage(settings.translationLanguage);
          setSelectedPara((current) =>
            current ? loadedParas.find((para) => para.id === current.id) ?? loadedParas[0] ?? null : loadedParas[0] ?? null
          );
        }
      } catch (error) {
        if ((error as Error).name !== "AbortError" && isMounted) {
          setParas([]);
          setSelectedPara(null);
        }
      } finally {
        if (isMounted) {
          setIsParaLoading(false);
        }
      }
    };

    loadParas();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [activeTab, paras, parasLanguage, settings.translationLanguage]);

  const displayedVerses = useMemo(() => {
    if (!selectedPara) {
      return surahDetail.verses;
    }

    return selectedPara.surahs.flatMap((paraSurah) =>
      paraSurah.verses.map((verse) => ({
        ...verse,
        surahId: paraSurah.id,
        surahName: paraSurah.transliteration,
      }))
    );
  }, [selectedPara, surahDetail.verses]);

  const filteredVerses = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase();

    if (!normalizedQuery) {
      return displayedVerses;
    }

    return displayedVerses.filter((verse) =>
      [verse.text, verse.translation, verse.transliteration]
        .filter(Boolean)
        .some((value) => value.toLocaleLowerCase().includes(normalizedQuery))
    );
  }, [displayedVerses, searchQuery]);

  const filteredSurahs = useMemo(() => {
    const normalizedQuery = surahSearch.trim().toLocaleLowerCase();

    if (!normalizedQuery) {
      return surahs;
    }

    return surahs.filter((item) =>
      [item.name, item.transliteration, String(item.id)]
        .filter(Boolean)
        .some((value) => value.toLocaleLowerCase().includes(normalizedQuery))
    );
  }, [surahSearch, surahs]);

  const filteredParas = useMemo(() => {
    const normalizedQuery = surahSearch.trim().toLocaleLowerCase();

    if (!normalizedQuery) {
      return paras;
    }

    return paras.filter((para) => {
      const searchableSurahs = para.surahs.flatMap((item) => [item.name, item.transliteration, String(item.id)]);
      return [`juz ${para.id}`, `para ${para.id}`, String(para.id), ...searchableSurahs].some((value) =>
        value.toLocaleLowerCase().includes(normalizedQuery)
      );
    });
  }, [paras, surahSearch]);

  const readerTitle = selectedPara ? `Juz ${selectedPara.id}` : surahDetail.transliteration;
  const readerSubtitle = selectedPara
    ? `${selectedPara.total_verses} Ayah, Surah ${selectedPara.start.surah}:${selectedPara.start.ayah} - ${selectedPara.end.surah}:${selectedPara.end.ayah}`
    : `Ayah-${surahDetail.total_verses}, ${surahDetail.type}`;

  return (
    <div className="dark h-screen overflow-hidden bg-background text-foreground">
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

      <div className="flex h-screen flex-col md:pl-16">
        <header className="flex h-13.5 shrink-0 items-center justify-between border-b border-border bg-background px-4">
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold leading-5 text-foreground">Al Huda</h1>
            <p className="mt-1 truncate text-[11px] text-muted-foreground">Read, Study, and Learn The Quran</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full bg-card px-3 py-2 text-sm text-muted-foreground md:flex">
              <Search className="h-4 w-4 text-primary" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search ayah"
                className="w-32 bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
              />
            </div>
            <button className="grid h-9 w-9 place-items-center rounded-full bg-card text-primary">
              <Leaf className="h-4 w-4" />
            </button>
            {selectedPara ? null : <BookmarkButton surahDetail={surahDetail} />}
            <button className="hidden items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground sm:flex">
              Support Us
              <Heart className="h-4 w-4 fill-primary-foreground" />
            </button>
          </div>
        </header>

        <div className="grid min-h-0 flex-1 lg:grid-cols-[334px_minmax(0,1fr)_342px]">
          <aside className="hidden min-h-0 border-r border-border bg-sidebar p-5 lg:block">
            <div className="mb-4 grid grid-cols-3 rounded-full bg-card p-1">
              {(["Surah", "Juz", "Page"] as ReaderTab[]).map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setActiveTab(item);
                    if (item === "Surah") {
                      setSelectedPara(null);
                    }
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    activeTab === item ? "bg-background text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="mb-4 flex items-center gap-3 rounded-full border border-border bg-card px-4 py-3 text-muted-foreground">
              <Search className="h-4 w-4" />
              <input
                value={surahSearch}
                onChange={(event) => setSurahSearch(event.target.value)}
                placeholder={activeTab === "Juz" ? "Search Juz" : "Search Surah"}
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
              />
            </div>

            <div className="green-scrollbar h-[calc(100vh-180px)] space-y-2 overflow-y-auto pr-1">
              {activeTab === "Surah" ? filteredSurahs.map((item) => {
                const active = item.id === surahDetail.id;

                return (
                  <Link
                    key={item.id}
                    href={`/surah/${item.id}`}
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
                      style={{ fontFamily: arabicFontFamilyMap[settings.arabicFont] }}
                    >
                      {item.name}
                    </span>
                  </Link>
                );
              }) : null}

              {activeTab === "Juz" && isParaLoading ? (
                <div className="rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-primary">
                  Loading juz list...
                </div>
              ) : null}

              {activeTab === "Juz" && !isParaLoading ? filteredParas.map((para) => {
                const active = para.id === selectedPara?.id;
                const firstSurah = para.surahs[0];
                const lastSurah = para.surahs[para.surahs.length - 1];

                return (
                  <button
                    key={para.id}
                    onClick={() => setSelectedPara(para)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
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
                      <span className="-rotate-45 text-sm font-bold">{para.id}</span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-foreground">Juz {para.id}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {firstSurah?.transliteration} - {lastSurah?.transliteration}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-muted-foreground">{para.total_verses} Ayah</span>
                  </button>
                );
              }) : null}

              {activeTab === "Page" ? (
                <div className="rounded-xl border border-border bg-card px-4 py-5 text-sm text-muted-foreground">
                  Page list will be available soon.
                </div>
              ) : null}
            </div>
          </aside>

          <main className="green-scrollbar min-h-0 overflow-y-auto bg-background">
            <section className="mx-auto max-w-5xl px-5 py-8 md:px-8">
              <div className="mb-10 grid grid-cols-[120px_minmax(0,1fr)_120px] items-center gap-4">
                <div className="hidden opacity-20 md:block">
                  <BookOpen className="h-20 w-20 text-muted-foreground" />
                </div>
                <div className="col-span-3 text-center md:col-span-1">
                  <h2 className="text-2xl font-bold text-foreground">{readerTitle}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{readerSubtitle}</p>
                </div>
                <div className="hidden md:block" />
              </div>

              {isTranslationLoading || isParaLoading ? (
                <div className="mb-6 rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-primary">
                  Loading selected {selectedPara ? "juz" : "translation"}...
                </div>
              ) : null}

              <div className="divide-y divide-border border-y border-border">
                {filteredVerses.length > 0 ? (
                  filteredVerses.map((verse) => (
                    <VerseCard key={`${"surahId" in verse ? verse.surahId : surahDetail.id}-${verse.id}`} verse={verse} settings={settings} />
                  ))
                ) : (
                  <div className="py-16 text-center">
                    <h3 className="text-xl font-bold text-foreground">No ayahs found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Try another word from the Arabic text or translation.</p>
                  </div>
                )}
              </div>

              {selectedPara ? (
                <div className="mt-8 flex items-center justify-between gap-4">
                  <button
                    onClick={() => setSelectedPara(paras.find((para) => para.id === selectedPara.id - 1) ?? selectedPara)}
                    className={`rounded-full px-5 py-3 text-sm font-bold transition ${
                      selectedPara.id > 1 ? "bg-card text-foreground hover:bg-accent" : "pointer-events-none opacity-0"
                    }`}
                  >
                    Previous Juz
                  </button>
                  <button
                    onClick={() => setSelectedPara(paras.find((para) => para.id === selectedPara.id + 1) ?? selectedPara)}
                    className={`rounded-full px-5 py-3 text-sm font-bold transition ${
                      selectedPara.id < 30 ? "bg-primary text-primary-foreground hover:bg-primary/90" : "pointer-events-none opacity-0"
                    }`}
                  >
                    Next Juz
                  </button>
                </div>
              ) : (
                <div className="mt-8 flex items-center justify-between gap-4">
                  <Link
                    href={surahDetail.id > 1 ? `/surah/${surahDetail.id - 1}` : "/"}
                    className={`rounded-full px-5 py-3 text-sm font-bold transition ${
                      surahDetail.id > 1 ? "bg-card text-foreground hover:bg-accent" : "pointer-events-none opacity-0"
                    }`}
                  >
                    Previous Surah
                  </Link>
                  <Link
                    href={surahDetail.id < 114 ? `/surah/${surahDetail.id + 1}` : "/"}
                    className={`rounded-full px-5 py-3 text-sm font-bold transition ${
                      surahDetail.id < 114 ? "bg-primary text-primary-foreground hover:bg-primary/90" : "pointer-events-none opacity-0"
                    }`}
                  >
                    Next Surah
                  </Link>
                </div>
              )}
            </section>
          </main>

          <aside className="hidden min-h-0 border-l border-border bg-sidebar p-7 xl:block">
            <div className="mb-7 grid grid-cols-2 rounded-full bg-card p-1">
              <button className="rounded-full bg-background px-4 py-2 text-sm font-bold text-foreground">Translation</button>
              <button className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground">Reading</button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between text-foreground">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-bold">Reading Settings</span>
                </div>
                <ChevronDown className="h-4 w-4" />
              </div>

              <div className="flex items-center justify-between text-primary">
                <div className="flex items-center gap-3">
                  <Type className="h-5 w-5" />
                  <span className="text-sm font-bold">Font Settings</span>
                </div>
                <ChevronDown className="h-4 w-4 rotate-180" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="translation-language" className="text-sm font-bold text-foreground">
                    Translation
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
                    className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none"
                  >
                    {translationLanguageOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <label htmlFor="arabic-font-size" className="text-sm font-bold text-foreground">
                      Arabic Font Size
                    </label>
                    <span className="text-sm font-bold text-primary">{settings.arabicFontSize}</span>
                  </div>
                  <input
                    id="arabic-font-size"
                    type="range"
                    min="24"
                    max="48"
                    step="1"
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

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <label htmlFor="translation-font-size" className="text-sm font-bold text-foreground">
                      Translation Font Size
                    </label>
                    <span className="text-sm font-bold text-primary">{settings.translationFontSize}</span>
                  </div>
                  <input
                    id="translation-font-size"
                    type="range"
                    min="14"
                    max="24"
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

                <div>
                  <label htmlFor="arabic-font" className="mb-3 block text-sm font-bold text-foreground">
                    Arabic Font Face
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
                    className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground outline-none"
                  >
                    {arabicFontOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rounded-xl border border-primary/30 bg-primary/10 p-4">
                <h3 className="text-base font-bold text-foreground">Help spread the knowledge of Islam</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Your regular support helps us reach our brothers and sisters with the message of Islam.
                </p>
                <button className="mt-4 w-full rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground">
                  Support Us
                </button>
              </div>
            </div>
          </aside>
        </div>

        <div className="fixed bottom-4 right-4 z-50 hidden rounded-lg bg-popover p-2 shadow-2xl md:grid md:grid-cols-5 md:gap-2 xl:right-91.5">
          {[Shield, Menu, Settings, SlidersHorizontal, MoreHorizontal, Grid2X2, Leaf, Compass, Play, Bookmark].map(
            (Icon, index) => (
              <button key={index} className="grid h-8 w-8 place-items-center rounded-md text-foreground hover:bg-accent">
                <Icon className="h-4 w-4" />
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
