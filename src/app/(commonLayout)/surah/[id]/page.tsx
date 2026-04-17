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

export default async function SurahPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const surah = await getSurahDetail(id);

  return <SurahReader surah={surah} />;
}
