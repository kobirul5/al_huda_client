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

interface ParaSurahSegment extends SurahListItem {
  start_ayah: number;
  end_ayah: number;
  verses: SurahDetail["verses"];
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

export const dynamicParams = false;

async function getSurahDetail(id: string): Promise<SurahDetail> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
  const res = await fetch(`${apiUrl}/quran/surahs/${id}`, {
    cache: "force-cache",
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
    cache: "force-cache",
  });

  if (!res.ok) {
    return [];
  }

  const jsonResponse = await res.json();
  return jsonResponse.data || [];
}

async function getParas(): Promise<ParaData[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
  const res = await fetch(`${apiUrl}/quran/paras?translation=en`, {
    cache: "force-cache",
  });

  if (!res.ok) {
    return [];
  }

  const jsonResponse = await res.json();
  return jsonResponse.data || [];
}

export function generateStaticParams() {
  return Array.from({ length: 114 }, (_, index) => ({
    id: String(index + 1),
  }));
}

export default async function SurahPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [surah, surahs, paras] = await Promise.all([getSurahDetail(id), getSurahs(), getParas()]);

  return <SurahReader surah={surah} surahs={surahs} initialParas={paras} initialParasLanguage="en" />;
}
