import React from "react";
import Link from "next/link";

export interface ISurah {
  id: number;
  name: string;
  transliteration: string;
  type: "meccan" | "medinan";
  total_verses: number;
}

interface SurahCardProps {
  surah: ISurah;
}

const SurahCard: React.FC<SurahCardProps> = ({ surah }) => {
  return (
    <Link
      href={`/surah/${surah.id}`}
      className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-md transition cursor-pointer group"
    >
      <div className="w-[42px] h-[42px] rounded-full flex items-center justify-center bg-primary text-primary-foreground font-bold shadow-sm transition-transform group-hover:scale-110">
        {surah.id}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xl text-right font-semibold text-foreground font-amiri leading-normal">
          {surah.name}
        </p>
        <p className="text-sm text-muted-foreground font-medium truncate">
          {surah.transliteration}
        </p>
      </div>

      <div className="text-right flex flex-col items-end gap-1.5">
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
            surah.type === "meccan"
              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
              : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
          }`}
        >
          {surah.type}
        </span>

        <div className="text-[11px] font-medium text-muted-foreground">
          <span className="text-foreground font-bold">
            {surah.total_verses}
          </span>{" "}
          verses
        </div>
      </div>
    </Link>
  );
};

export default SurahCard;
