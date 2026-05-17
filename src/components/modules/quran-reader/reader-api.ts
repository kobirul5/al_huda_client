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
const QURAN_CDN_URL = "https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist";
const FETCH_TIMEOUT = 8000;

function isLocalhostApiInProduction(url: string) {
  return process.env.NODE_ENV === "production" && /^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(url);
}

async function fetchWithTimeout(url: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  return fetch(url, {
    ...init,
    signal: controller.signal,
  }).finally(() => clearTimeout(timeoutId));
}

async function fetchApi(url: string): Promise<Response | null> {
  if (isLocalhostApiInProduction(API_URL)) {
    return null;
  }

  try {
    return await fetchWithTimeout(url, {
      next: { revalidate: 3600 },
    });
  } catch (error) {
    console.error("Quran backend fetch failed:", error);
    return null;
  }
}

function withAudioUrls(surah: SurahDetail): SurahDetail {
  return {
    ...surah,
    verses: surah.verses.map((verse) => {
      const surahPadded = String(surah.id).padStart(3, "0");
      const ayahPadded = String(verse.id).padStart(3, "0");

      return {
        ...verse,
        surahId: surah.id,
        audio: verse.audio || `https://verses.quran.com/Alafasy/mp3/${surahPadded}${ayahPadded}.mp3`,
      };
    }),
  };
}

async function getSurahsFromCdn(): Promise<SurahListItem[]> {
  try {
    const response = await fetchWithTimeout(`${QURAN_CDN_URL}/chapters/index.json`, {
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      return [];
    }

    return response.json();
  } catch (error) {
    console.error("Quran CDN surah index fetch failed:", error);
    return [];
  }
}

async function getSurahDetailFromCdn(
  id: string,
  translation: TranslationLanguage = "en"
): Promise<SurahDetail | null> {
  try {
    const response = await fetchWithTimeout(`${QURAN_CDN_URL}/chapters/${translation}/${id}.json`, {
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      return null;
    }

    const surah = await response.json();
    return withAudioUrls(surah);
  } catch (error) {
    console.error("Quran CDN surah detail fetch failed:", error);
    return null;
  }
}

export async function getSurahs(): Promise<SurahListItem[]> {
  const response = await fetchApi(`${API_URL}/quran/surahs`);

  if (response?.ok) {
    const result = await response.json();
    return result.data || [];
  }

  return getSurahsFromCdn();
}

export async function getSurahDetail(
  id: string,
  translation: TranslationLanguage = "en"
): Promise<SurahDetail> {
  const response = await fetchApi(`${API_URL}/quran/surahs/${id}?translation=${translation}`);

  if (response?.ok) {
    const result = await response.json();
    return result.data;
  }

  const fallbackSurah = await getSurahDetailFromCdn(id, translation);
  if (fallbackSurah) {
    return fallbackSurah;
  }

  throw new Error("Failed to fetch surah detail");
}

export async function getParas(): Promise<ParaSummary[]> {
  const response = await fetchApi(`${API_URL}/quran/paras`);

  if (response?.ok) {
    const result = await response.json();
    return result.data || [];
  }

  return [];
}

export async function getParaDetail(
  id: string,
  translation: TranslationLanguage = "en"
): Promise<ParaDetail> {
  const response = await fetchApi(`${API_URL}/quran/paras/${id}?translation=${translation}`);

  if (response?.ok) {
    const result = await response.json();
    return result.data;
  }

  throw new Error("Failed to fetch juz detail");
}

export async function getPages(): Promise<PageSummary[]> {
  const response = await fetchApi(`${API_URL}/quran/pages`);

  if (response?.ok) {
    const result = await response.json();
    return result.data || [];
  }

  return [];
}

export async function getPageDetail(
  id: string,
  translation: TranslationLanguage = "en"
): Promise<PageDetail> {
  const response = await fetchApi(`${API_URL}/quran/pages/${id}?translation=${translation}`);

  if (response?.ok) {
    const result = await response.json();
    return result.data;
  }

  throw new Error("Failed to fetch page detail");
}
