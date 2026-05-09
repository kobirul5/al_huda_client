import React from "react";
import dayjs from "dayjs";

interface DuaCardProps {
  type: string;
  time: string;
  location: string;
  icon: React.ReactNode;
  arabic: string;
  translation: string;
}

const DuaCard: React.FC<DuaCardProps> = ({ type, time, location, icon, arabic, translation }) => (
  <div className="bg-card/80 backdrop-blur-xl border border-border rounded-[2.5rem] p-10 flex flex-col items-center text-center hover:border-primary/30 transition-all shadow-lg">
    <div className="flex items-center gap-3 mb-6">
      {icon}
      <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Today's {type} Time in {location}</h3>
    </div>
    
    <div className="text-5xl font-black text-primary mb-8 tracking-tighter">
      {dayjs(`2000-01-01 ${time}`).format("hh:mm A")}
    </div>

    <div className="w-full h-px bg-border mb-8" />

    <p className="font-arabic-naskh text-2xl md:text-3xl text-foreground mb-6 leading-relaxed" dir="rtl">
      {arabic}
    </p>
    
    <p className="text-xs md:text-sm text-muted-foreground font-medium leading-relaxed max-w-[280px]">
      {translation}
    </p>
  </div>
);

export default DuaCard;
