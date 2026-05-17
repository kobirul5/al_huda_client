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
const QURAN_META_URL = "https://api.alquran.cloud/v1/meta";
const FETCH_TIMEOUT = 8000;
const TOTAL_QURAN_PAGES = 604;

interface PageBoundary {
  id: number;
  start: {
    surah: number;
    ayah: number;
  };
  end: {
    surah: number;
    ayah: number;
  };
}

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

async function getPageBoundariesFromCdn(surahs: SurahListItem[]): Promise<PageBoundary[]> {
  try {
    const response = await fetchWithTimeout(QURAN_META_URL, {
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      return [];
    }

    const result = await response.json();
    const pageReferences = result?.data?.pages?.references as
      | Array<{ surah: number; ayah: number }>
      | undefined;

    if (!pageReferences || pageReferences.length !== TOTAL_QURAN_PAGES) {
      return [];
    }

    return pageReferences.map((reference, index) => {
      const nextReference = pageReferences[index + 1];
      const end = nextReference
        ? {
            surah: nextReference.surah === reference.surah ? reference.surah : nextReference.surah - 1,
            ayah:
              nextReference.surah === reference.surah
                ? nextReference.ayah - 1
                : surahs.find((surah) => surah.id === nextReference.surah - 1)?.total_verses ?? 0,
          }
        : {
            surah: 114,
            ayah: surahs.find((surah) => surah.id === 114)?.total_verses ?? 6,
          };

      return {
        id: index + 1,
        start: reference,
        end,
      };
    });
  } catch (error) {
    console.error("Quran page metadata fallback fetch failed:", error);
    return [];
  }
}

function getPageSummaryFromBoundary(boundary: PageBoundary, surahs: SurahListItem[]): PageSummary {
  const pageSurahs = surahs
    .filter((surah) => surah.id >= boundary.start.surah && surah.id <= boundary.end.surah)
    .map((surah) => {
      const startAyah = surah.id === boundary.start.surah ? boundary.start.ayah : 1;
      const endAyah = surah.id === boundary.end.surah ? boundary.end.ayah : surah.total_verses;

      return {
        id: surah.id,
        name: surah.name,
        transliteration: surah.transliteration,
        start_ayah: startAyah,
        end_ayah: endAyah,
      };
    });

  return {
    id: boundary.id,
    start: boundary.start,
    end: boundary.end,
    total_surahs: pageSurahs.length,
    total_verses: pageSurahs.reduce((total, surah) => total + surah.end_ayah - surah.start_ayah + 1, 0),
    surahs: pageSurahs,
  };
}

async function getPagesFromCdn(): Promise<PageSummary[]> {
  const surahs = await getSurahsFromCdn();
  if (surahs.length === 0) {
    return [];
  }

  const boundaries = await getPageBoundariesFromCdn(surahs);
  return boundaries.map((boundary) => getPageSummaryFromBoundary(boundary, surahs));
}

async function getPageDetailFromCdn(
  id: string,
  translation: TranslationLanguage = "en"
): Promise<PageDetail | null> {
  const pageId = Number(id);

  if (!Number.isInteger(pageId) || pageId < 1 || pageId > TOTAL_QURAN_PAGES) {
    return null;
  }

  const surahs = await getSurahsFromCdn();
  if (surahs.length === 0) {
    return null;
  }

  const boundaries = await getPageBoundariesFromCdn(surahs);
  const boundary = boundaries.find((page) => page.id === pageId);

  if (!boundary) {
    return null;
  }

  const pageSummary = getPageSummaryFromBoundary(boundary, surahs);
  const pageSurahs = await Promise.all(
    pageSummary.surahs.map(async (surah) => {
      const surahDetail = await getSurahDetailFromCdn(String(surah.id), translation);

      return {
        ...surah,
        verses: surahDetail?.verses.filter(
          (verse) => verse.id >= surah.start_ayah && verse.id <= surah.end_ayah
        ) ?? [],
      };
    })
  );

  return {
    ...pageSummary,
    total_verses: pageSurahs.reduce((total, surah) => total + surah.verses.length, 0),
    surahs: pageSurahs,
  };
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

  return getPagesFromCdn();
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

  const fallbackPage = await getPageDetailFromCdn(id, translation);
  if (fallbackPage) {
    return fallbackPage;
  }

  throw new Error("Failed to fetch page detail");
}
