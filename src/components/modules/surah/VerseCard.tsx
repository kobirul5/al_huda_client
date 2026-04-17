import React from "react";

interface VerseCardProps {
  verse: {
    id: number;
    text: string;
    translation: string;
    transliteration: string;
  };
}

const VerseCard: React.FC<VerseCardProps> = ({ verse }) => {
  return (
    <div className="group p-6 md:p-8 rounded-3xl border border-border bg-card hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-xl">
      <div className="flex justify-between items-start mb-8 gap-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-muted text-muted-foreground font-bold text-sm">
          {verse.id}
        </div>
        
        <p className="text-3xl md:text-4xl text-right font-amiri leading-[2] text-foreground flex-1">
          {verse.text}
        </p>
      </div>

      <div className="space-y-4 pt-6 border-t border-border/50">
        <p className="text-sm italic text-primary/70 font-medium tracking-wide">
          {verse.transliteration}
        </p>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-medium">
          {verse.translation}
        </p>
      </div>
    </div>
  );
};

export default VerseCard;
