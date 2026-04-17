"use client";

import React, { useState, useMemo } from "react";
import SurahCard, { ISurah } from "./SurahCard";

interface SurahListProps {
  initialSurahs: ISurah[];
}

const SurahList: React.FC<SurahListProps> = ({ initialSurahs }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "meccan" | "medinan">("all");

  const filteredSurahs = useMemo(() => {
    return initialSurahs.filter((s) => {
      const q = search.toLowerCase();
      const matchSearch =
        s.transliteration.toLowerCase().includes(q) ||
        s.name.includes(q) ||
        String(s.id).includes(q);
      const matchFilter = filter === "all" || s.type === filter;
      return matchSearch && matchFilter;
    });
  }, [initialSurahs, search, filter]);

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-12">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-6 mb-10 items-center">
        <div className="relative flex-1 w-full group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2"/>
              <path d="M14.5 14.5L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <input
            className="w-full px-5 py-4 pl-12 rounded-2xl border-2 border-border bg-card text-foreground font-medium placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-sm"
            placeholder="Search by name, transliteration or number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 p-1.5 rounded-2xl bg-muted/50 border border-border/50 backdrop-blur-sm">
          {(["all", "meccan", "medinan"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all duration-300 ${
                filter === f
                  ? "bg-white text-primary shadow-lg scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/40"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 flex justify-between items-center px-2">
        <p className="text-sm font-medium text-muted-foreground">
          Showing <span className="text-foreground font-bold">{filteredSurahs.length}</span> surahs
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSurahs.length > 0 ? (
          filteredSurahs.map((surah) => (
            <SurahCard key={surah.id} surah={surah} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-muted/20 rounded-3xl border-2 border-dashed border-border">
            <div className="text-5xl mb-4 opacity-40">🔍</div>
            <h3 className="text-xl font-bold text-foreground">No Surahs Found</h3>
            <p className="text-muted-foreground mt-2 font-medium">Try searching with a different keyword</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurahList;
