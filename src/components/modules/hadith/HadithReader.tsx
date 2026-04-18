"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import HadithSidebar from "./HadithSidebar";
import HadithCard from "./HadithCard";
import { Loader2 } from "lucide-react";

interface Hadith {
  number: number;
  arabic: string;
  english: string;
  bangla: string;
}

interface HadithReaderProps {
  bookName: string;
  initialHadiths: Hadith[];
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

export default function HadithReader({ bookName, initialHadiths }: HadithReaderProps) {
  const [hadiths, setHadiths] = useState<Hadith[]>(initialHadiths);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHadiths.length === 20);
  const displayName = bookNames[bookName] || bookName;
  
  const observer = useRef<IntersectionObserver | null>(null);
  const lastHadithElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    // Reset state when bookName changes
    setHadiths(initialHadiths);
    setPage(1);
    setHasMore(initialHadiths.length === 20);
  }, [bookName, initialHadiths]);

  useEffect(() => {
    if (page === 1) return;

    const fetchMoreHadiths = async () => {
      setLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
        const res = await fetch(`${apiUrl}/hadith/${bookName}?page=${page}&limit=20`);
        const json = await res.json();
        const newHadiths = json.data || [];
        
        if (newHadiths.length < 20) {
          setHasMore(false);
        }
        
        setHadiths((prev) => [...prev, ...newHadiths]);
      } catch (error) {
        console.error("Error fetching more hadiths:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoreHadiths();
  }, [page, bookName]);

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
              hadiths.map((hadith, index) => {
                if (hadiths.length === index + 1) {
                  return (
                    <div ref={lastHadithElementRef} key={hadith.number}>
                      <HadithCard hadith={hadith} />
                    </div>
                  );
                } else {
                  return <HadithCard key={hadith.number} hadith={hadith} />;
                }
              })
            ) : (
              <div className="flex h-60 items-center justify-center rounded-xl bg-slate-50 text-slate-500 italic">
                No hadiths found for this collection.
              </div>
            )}
            
            {loading && (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            
            {!hasMore && hadiths.length > 0 && (
              <div className="py-8 text-center text-muted-foreground italic">
                You have reached the end of this collection.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
