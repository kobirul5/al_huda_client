import React from "react";

export interface ReaderSettings {
  arabicFont: "amiri" | "notoNaskh";
  arabicFontSize: number;
  translationFontSize: number;
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
  const translationSpacing = Math.max(Math.round(settings.translationFontSize * 0.75), 14);
  const transliterationSize = Math.max(settings.translationFontSize - 2, 14);

  return (
    <div className="group p-6 md:p-8 rounded-3xl border border-border bg-card hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-xl">
      <div className="flex justify-between items-start mb-8 gap-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-muted text-muted-foreground font-bold text-sm">
          {verse.id}
        </div>

        <p
          className="text-right leading-[2] text-foreground flex-1 transition-[font-size] duration-200"
          style={{
            fontFamily: arabicFontFamilyMap[settings.arabicFont],
            fontSize: `${settings.arabicFontSize}px`,
          }}
        >
          {verse.text}
        </p>
      </div>

      <div className="space-y-4 pt-6 border-t border-border/50">
        <p
          className="italic text-primary/70 font-medium tracking-wide transition-[font-size,line-height] duration-200"
          style={{
            fontSize: `${transliterationSize}px`,
            lineHeight: `${Math.round(transliterationSize * 1.7)}px`,
          }}
        >
          {verse.transliteration}
        </p>
        <p
          className="text-muted-foreground font-medium transition-[font-size,line-height] duration-200"
          style={{
            fontSize: `${settings.translationFontSize}px`,
            lineHeight: `${translationLineHeight}px`,
            marginTop: `${translationSpacing}px`,
          }}
        >
          {verse.translation}
        </p>
      </div>
    </div>
  );
};

export default VerseCard;
