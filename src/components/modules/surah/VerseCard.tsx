import React from "react";

export interface ReaderSettings {
  arabicFont: "amiri" | "notoNaskh";
  arabicFontSize: number;
  translationFontSize: number;
}

interface VerseCardProps {
  verse: {
    id: number;
    text: string;
    translation: string;
    transliteration: string;
  };
  settings: ReaderSettings;
}

const arabicFontClassMap: Record<ReaderSettings["arabicFont"], string> = {
  amiri: "font-arabic-amiri",
  notoNaskh: "font-arabic-naskh",
};

const VerseCard: React.FC<VerseCardProps> = ({ verse, settings }) => {
  const translationLineHeight = Math.round(settings.translationFontSize * 1.8);

  return (
    <div className="group p-6 md:p-8 rounded-3xl border border-border bg-card hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-xl">
      <div className="flex justify-between items-start mb-8 gap-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-muted text-muted-foreground font-bold text-sm">
          {verse.id}
        </div>

        <p
          className={`text-right leading-[2] text-foreground flex-1 ${arabicFontClassMap[settings.arabicFont]}`}
          style={{ fontSize: `${settings.arabicFontSize}px` }}
        >
          {verse.text}
        </p>
      </div>

      <div className="space-y-4 pt-6 border-t border-border/50">
        <p className="text-sm italic text-primary/70 font-medium tracking-wide">
          {verse.transliteration}
        </p>
        <p
          className="text-muted-foreground font-medium transition-[font-size,line-height] duration-200"
          style={{
            fontSize: settings.translationFontSize,
            lineHeight: `${translationLineHeight}px`,
          }}
        >
          {verse.translation}
        </p>
      </div>
    </div>
  );
};

export default VerseCard;
