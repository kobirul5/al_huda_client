import React from "react";
import Link from "next/link";
import VerseCard from "@/components/modules/surah/VerseCard";

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

export default async function SurahPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const surah = await getSurahDetail(id);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Detail Header */}
      <section className="relative pt-24 pb-16 px-6 text-center overflow-hidden bg-[#0F172A]">
        {/* Decorative mask */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-primary rounded-full blur-[150px]" />
        </div>

        <div className="relative max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-primary transition-colors mb-10 group"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="group-hover:-translate-x-1 transition-transform">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Home
          </Link>

          <div className="flex flex-col items-center">
             <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-xl mb-6 shadow-glow">
              {surah.id}
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 font-amiri tracking-tight">
              {surah.name}
            </h1>
            <p className="text-xl text-slate-400 font-medium mb-8">
              {surah.transliteration} — {surah.type}
            </p>
            
            <div className="flex gap-4">
              <span className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white text-sm font-bold">
                {surah.total_verses} Verses
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Verses Container */}
      <main className="max-w-[900px] mx-auto px-4 mt-[-40px] relative z-10">
        <div className="flex flex-col gap-6">
          {surah.verses.map((verse) => (
            <VerseCard key={verse.id} verse={verse} />
          ))}
        </div>

        {/* Navigation Footer */}
        <div className="mt-16 flex justify-between items-center bg-card border border-border p-6 rounded-3xl shadow-lg">
           <Link
            href={surah.id > 1 ? `/surah/${surah.id - 1}` : "/"}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all ${
              surah.id > 1 ? "bg-muted text-foreground hover:bg-primary hover:text-white" : "opacity-0 pointer-events-none"
            }`}
          >
            Previous Surah
          </Link>

          <Link
            href={surah.id < 114 ? `/surah/${surah.id + 1}` : "/"}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all ${
              surah.id < 114 ? "bg-primary text-white hover:shadow-glow" : "opacity-0 pointer-events-none"
            }`}
          >
            Next Surah
          </Link>
        </div>
      </main>
    </div>
  );
}
