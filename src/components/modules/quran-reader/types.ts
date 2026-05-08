import { ReaderSettings } from "@/components/modules/surah/VerseCard";

export interface Verse {
  id: number;
  text: string;
  translation: string;
  transliteration: string;
  surahId?: number;
  surahName?: string;
  surahArabicName?: string;
  showSurahHeading?: boolean;
  headingAnchorId?: string;
}

export interface SurahListItem {
  id: number;
  name: string;
  transliteration: string;
  type: string;
  total_verses: number;
}

export interface SurahDetail extends SurahListItem {
  verses: Verse[];
}

export interface ParaSurahSegment extends SurahListItem {
  start_ayah: number;
  end_ayah: number;
  verses: Verse[];
}

export interface ParaSurahSummary extends SurahListItem {
  start_ayah: number;
  end_ayah: number;
}

export interface ParaSummary {
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
  surahs: ParaSurahSummary[];
}

export interface ParaDetail {
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

export type ReaderTab = "surah" | "juz" | "page";

export type TranslationLanguage = ReaderSettings["translationLanguage"];
