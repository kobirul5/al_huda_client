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

interface JuzBoundary {
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

const juzBoundaries: JuzBoundary[] = [
  { id: 1, start: { surah: 1, ayah: 1 }, end: { surah: 2, ayah: 141 } },
  { id: 2, start: { surah: 2, ayah: 142 }, end: { surah: 2, ayah: 252 } },
  { id: 3, start: { surah: 2, ayah: 253 }, end: { surah: 3, ayah: 92 } },
  { id: 4, start: { surah: 3, ayah: 93 }, end: { surah: 4, ayah: 23 } },
  { id: 5, start: { surah: 4, ayah: 24 }, end: { surah: 4, ayah: 147 } },
  { id: 6, start: { surah: 4, ayah: 148 }, end: { surah: 5, ayah: 81 } },
  { id: 7, start: { surah: 5, ayah: 82 }, end: { surah: 6, ayah: 110 } },
  { id: 8, start: { surah: 6, ayah: 111 }, end: { surah: 7, ayah: 87 } },
  { id: 9, start: { surah: 7, ayah: 88 }, end: { surah: 8, ayah: 40 } },
  { id: 10, start: { surah: 8, ayah: 41 }, end: { surah: 9, ayah: 92 } },
  { id: 11, start: { surah: 9, ayah: 93 }, end: { surah: 11, ayah: 5 } },
  { id: 12, start: { surah: 11, ayah: 6 }, end: { surah: 12, ayah: 52 } },
  { id: 13, start: { surah: 12, ayah: 53 }, end: { surah: 14, ayah: 52 } },
  { id: 14, start: { surah: 15, ayah: 1 }, end: { surah: 16, ayah: 128 } },
  { id: 15, start: { surah: 17, ayah: 1 }, end: { surah: 18, ayah: 74 } },
  { id: 16, start: { surah: 18, ayah: 75 }, end: { surah: 20, ayah: 135 } },
  { id: 17, start: { surah: 21, ayah: 1 }, end: { surah: 22, ayah: 78 } },
  { id: 18, start: { surah: 23, ayah: 1 }, end: { surah: 25, ayah: 20 } },
  { id: 19, start: { surah: 25, ayah: 21 }, end: { surah: 27, ayah: 55 } },
  { id: 20, start: { surah: 27, ayah: 56 }, end: { surah: 29, ayah: 45 } },
  { id: 21, start: { surah: 29, ayah: 46 }, end: { surah: 33, ayah: 30 } },
  { id: 22, start: { surah: 33, ayah: 31 }, end: { surah: 36, ayah: 27 } },
  { id: 23, start: { surah: 36, ayah: 28 }, end: { surah: 39, ayah: 31 } },
  { id: 24, start: { surah: 39, ayah: 32 }, end: { surah: 41, ayah: 46 } },
  { id: 25, start: { surah: 41, ayah: 47 }, end: { surah: 45, ayah: 37 } },
  { id: 26, start: { surah: 46, ayah: 1 }, end: { surah: 51, ayah: 30 } },
  { id: 27, start: { surah: 51, ayah: 31 }, end: { surah: 57, ayah: 29 } },
  { id: 28, start: { surah: 58, ayah: 1 }, end: { surah: 66, ayah: 12 } },
  { id: 29, start: { surah: 67, ayah: 1 }, end: { surah: 77, ayah: 50 } },
  { id: 30, start: { surah: 78, ayah: 1 }, end: { surah: 114, ayah: 6 } },
];

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

function getParaSummaryFromBoundary(boundary: JuzBoundary, surahs: SurahListItem[]): ParaSummary {
  const juzSurahs = surahs
    .filter((surah) => surah.id >= boundary.start.surah && surah.id <= boundary.end.surah)
    .map((surah) => {
      const startAyah = surah.id === boundary.start.surah ? boundary.start.ayah : 1;
      const endAyah = surah.id === boundary.end.surah ? boundary.end.ayah : surah.total_verses;

      return {
        ...surah,
        start_ayah: startAyah,
        end_ayah: endAyah,
      };
    });

  return {
    id: boundary.id,
    start: boundary.start,
    end: boundary.end,
    total_surahs: juzSurahs.length,
    total_verses: juzSurahs.reduce((total, surah) => total + surah.end_ayah - surah.start_ayah + 1, 0),
    surahs: juzSurahs,
  };
}

async function getParasFromCdn(): Promise<ParaSummary[]> {
  const surahs = await getSurahsFromCdn();
  if (surahs.length === 0) {
    return [];
  }

  return juzBoundaries.map((boundary) => getParaSummaryFromBoundary(boundary, surahs));
}

async function getParaDetailFromCdn(
  id: string,
  translation: TranslationLanguage = "en"
): Promise<ParaDetail | null> {
  const paraId = Number(id);

  if (!Number.isInteger(paraId) || paraId < 1 || paraId > juzBoundaries.length) {
    return null;
  }

  const surahs = await getSurahsFromCdn();
  if (surahs.length === 0) {
    return null;
  }

  const boundary = juzBoundaries.find((juz) => juz.id === paraId);
  if (!boundary) {
    return null;
  }

  const paraSummary = getParaSummaryFromBoundary(boundary, surahs);
  const paraSurahs = await Promise.all(
    paraSummary.surahs.map(async (surah) => {
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
    ...paraSummary,
    total_verses: paraSurahs.reduce((total, surah) => total + surah.verses.length, 0),
    surahs: paraSurahs,
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

  return getParasFromCdn();
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

  const fallbackPara = await getParaDetailFromCdn(id, translation);
  if (fallbackPara) {
    return fallbackPara;
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
