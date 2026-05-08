import React from "react";
import SurahReader from "@/components/modules/surah/SurahReader";

interface SurahDetail {
  id: number;
  name: string;
  transliteration: string;
  type: string;
  total_verses: number;
  verses: {
    id: number;
    text: string;
    translation: string;
    transliteration: string;
  }[];
}

interface SurahListItem {
  id: number;
  name: string;
  transliteration: string;
  type: string;
  total_verses: number;
}

async function getSurahDetail(id: string): Promise<SurahDetail> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
  const res = await fetch(`${apiUrl}/quran/surahs/${id}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch surah detail");
  }

  const jsonResponse = await res.json();
  return jsonResponse.data;
}

async function getSurahs(): Promise<SurahListItem[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
  const res = await fetch(`${apiUrl}/quran/surahs`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return [];
  }

  const jsonResponse = await res.json();
  return jsonResponse.data || [];
}

export default async function SurahPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [surah, surahs] = await Promise.all([getSurahDetail(id), getSurahs()]);

  return <SurahReader surah={surah} surahs={surahs} />;
}
