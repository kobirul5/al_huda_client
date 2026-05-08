import {
  PageDetail,
  PageSummary,
  ParaDetail,
  ParaSummary,
  SurahDetail,
  SurahListItem,
  TranslationLanguage,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function getSurahs(): Promise<SurahListItem[]> {
  const response = await fetch(`${API_URL}/quran/surahs`, {
    cache: "force-cache",
  });

  if (!response.ok) {
    return [];
  }

  const result = await response.json();
  return result.data || [];
}

export async function getSurahDetail(
  id: string,
  translation: TranslationLanguage = "en"
): Promise<SurahDetail> {
  const response = await fetch(`${API_URL}/quran/surahs/${id}?translation=${translation}`, {
    cache: "force-cache",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch surah detail");
  }

  const result = await response.json();
  return result.data;
}

export async function getParas(): Promise<ParaSummary[]> {
  const response = await fetch(`${API_URL}/quran/paras`, {
    cache: "force-cache",
  });

  if (!response.ok) {
    return [];
  }

  const result = await response.json();
  return result.data || [];
}

export async function getParaDetail(
  id: string,
  translation: TranslationLanguage = "en"
): Promise<ParaDetail> {
  const response = await fetch(`${API_URL}/quran/paras/${id}?translation=${translation}`, {
    cache: "force-cache",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch juz detail");
  }

  const result = await response.json();
  return result.data;
}

export async function getPages(): Promise<PageSummary[]> {
  const response = await fetch(`${API_URL}/quran/pages`, {
    cache: "force-cache",
  });

  if (!response.ok) {
    return [];
  }

  const result = await response.json();
  return result.data || [];
}

export async function getPageDetail(
  id: string,
  translation: TranslationLanguage = "en"
): Promise<PageDetail> {
  const response = await fetch(`${API_URL}/quran/pages/${id}?translation=${translation}`, {
    cache: "force-cache",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch page detail");
  }

  const result = await response.json();
  return result.data;
}
