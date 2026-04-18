"use client";

import React from "react";
import HadithSidebar from "./HadithSidebar";
import HadithCard from "./HadithCard";

interface HadithReaderProps {
  bookName: string;
  hadiths: {
    number: number;
    arabic: string;
    english: string;
    bangla: string;
  }[];
}

const bookNames: Record<string, string> = {
  bukhari: "Sahih al-Bukhari",
  muslim: "Sahih Muslim",
  tirmidhi: "Jami' at-Tirmidhi",
  abudawud: "Sunan Abi Dawud",
  nasai: "Sunan an-Nasa'i",
  ibnmajah: "Sunan Ibn Majah",
  malik: "Muwatta Malik",
  ahmed: "Musnad Ahmed",
  darimi: "Sunan ad-Darimi",
};

export default function HadithReader({ bookName, hadiths }: HadithReaderProps) {
  const displayName = bookNames[bookName] || bookName;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <HadithSidebar />
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">
          <div className="mb-8 flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">{displayName}</h1>
            <p className="text-muted-foreground">Exploring the collections of prophet Muhammad (PBUH)</p>
            <div className="mt-4 h-1.5 w-24 rounded-full bg-primary" />
          </div>

          <div className="flex flex-col">
            {hadiths && hadiths.length > 0 ? (
              hadiths.map((hadith) => (
                <HadithCard key={hadith.number} hadith={hadith} />
              ))
            ) : (
              <div className="flex h-60 items-center justify-center rounded-xl bg-slate-50 text-slate-500 italic">
                No hadiths found for this collection.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
