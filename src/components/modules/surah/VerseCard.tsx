import React from "react";

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
    text: string;
    translation: string;
    transliteration: string;
  };
  settings: ReaderSettings;
}

const VerseCard: React.FC<VerseCardProps> = ({ verse, settings }) => {
  const translationLineHeight = Math.round(settings.translationFontSize * 1.8);

  return (
    <article className="grid gap-5 py-8 md:grid-cols-[54px_minmax(0,1fr)] md:py-9">
      <div className="flex items-start gap-4 md:block">
        <div className="text-sm font-bold text-primary">{verse.id}</div>
        <div className="mt-6 hidden space-y-7 text-muted-foreground md:block">
          <button className="block transition hover:text-foreground" title="Play ayah">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M7 5.5v9l7-4.5-7-4.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="block transition hover:text-foreground" title="Read notes">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M5 4.5h8.5A1.5 1.5 0 0 1 15 6v9.2l-2.6-1.4L10 15.2l-2.4-1.4L5 15.2V4.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="block transition hover:text-foreground" title="Bookmark">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M6 4.5h8v11l-4-2.4-4 2.4v-11Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="block text-lg leading-none transition hover:text-foreground" title="More">
            ...
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
