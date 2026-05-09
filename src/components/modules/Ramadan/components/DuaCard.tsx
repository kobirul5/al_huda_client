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
  <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-6 flex flex-col items-center text-center hover:border-primary/30 transition-all shadow-md">
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Today's {type} Time in {location}</h3>
    </div>
    
    <div className="text-3xl font-black text-primary mb-6 tracking-tighter">
      {dayjs(`2000-01-01 ${time}`).format("hh:mm A")}
    </div>

    <div className="w-full h-px bg-border mb-6" />

    <p className="font-arabic-naskh text-xl md:text-2xl text-foreground mb-4 leading-relaxed" dir="rtl">
      {arabic}
    </p>
    
    <p className="text-[10px] md:text-xs text-muted-foreground font-medium leading-relaxed max-w-[240px]">
      {translation}
    </p>
  </div>
);

export default DuaCard;
