import React from "react";
import { Bookmark, MoreHorizontal, Play, StickyNote } from "lucide-react";

export interface ReaderSettings {
  arabicFont: "amiri" | "notoNaskh";
  arabicFontSize: number;
  translationFontSize: number;
  translationLanguage: "en" | "bn";
}

export const arabicFontFamilyMap: Record<ReaderSettings["arabicFont"], string> = {
  amiri: "var(--font-arabic-amiri), serif",
  notoNaskh: "var(--font-arabic-naskh), serif",
};

interface VerseCardProps {
  verse: {
    id: number;
    surahId?: number;
    surahName?: string;
    headingAnchorId?: string;
    text: string;
    translation: string;
    transliteration: string;
  };
  settings: ReaderSettings;
}

const VerseCard: React.FC<VerseCardProps> = ({ verse, settings }) => {
  const translationLineHeight = Math.round(settings.translationFontSize * 1.8);
  const verseAnchorId = verse.headingAnchorId
    ? undefined
    : verse.surahId
      ? `surah-${verse.surahId}-ayah-${verse.id}`
      : undefined;

  return (
    <article id={verseAnchorId} className="scroll-mt-8 grid gap-5 py-8 md:grid-cols-[54px_minmax(0,1fr)] md:py-9">
      <div className="flex items-start gap-4 md:block">
        <div className="text-sm font-bold text-primary">{verse.id}</div>
        <div className="mt-6 hidden space-y-5 text-muted-foreground md:block">
          <button className="grid h-8 w-8 place-items-center rounded-md transition hover:bg-accent hover:text-foreground" title="Play ayah">
            <Play className="h-5 w-5" />
          </button>
          <button className="grid h-8 w-8 place-items-center rounded-md transition hover:bg-accent hover:text-foreground" title="Read notes">
            <StickyNote className="h-5 w-5" />
          </button>
          <button className="grid h-8 w-8 place-items-center rounded-md transition hover:bg-accent hover:text-foreground" title="Bookmark">
            <Bookmark className="h-5 w-5" />
          </button>
          <button className="grid h-8 w-8 place-items-center rounded-md transition hover:bg-accent hover:text-foreground" title="More">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="min-w-0">
        <p
          className="mb-8 text-right leading-loose text-foreground transition-[font-size] duration-200"
          style={{
            fontFamily: arabicFontFamilyMap[settings.arabicFont],
            fontSize: `${settings.arabicFontSize}px`,
          }}
        >
          {verse.text}
        </p>

        <p
          className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
        >
          Saheeh International
        </p>
        <p
          className="max-w-4xl text-foreground/85 transition-[font-size,line-height] duration-200"
          style={{
            fontSize: `${settings.translationFontSize}px`,
            lineHeight: `${translationLineHeight}px`,
          }}
        >
          {verse.translation}
        </p>
      </div>
    </article>
  );
};

export default VerseCard;
