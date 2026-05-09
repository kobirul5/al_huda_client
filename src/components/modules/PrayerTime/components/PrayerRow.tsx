import React from "react";

interface PrayerRowProps {
  name: string;
  time: string;
  endTime: string;
  isActive: boolean;
  icon: React.ReactNode;
}

const PrayerRow: React.FC<PrayerRowProps> = ({ name, time, endTime, isActive, icon }) => (
  <div className={`grid grid-cols-12 items-center px-6 py-4 rounded-2xl transition-all duration-300 ${isActive ? 'bg-primary/10 border border-primary/20 shadow-sm' : 'hover:bg-muted/50'}`}>
    <div className="col-span-6 flex items-center gap-4">
      <div className={`p-2 rounded-lg ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
        {icon}
      </div>
      <span className={`text-lg font-bold ${isActive ? 'text-primary' : 'text-foreground/80'}`}>{name}</span>
    </div>
    <div className={`col-span-3 text-right font-bold font-mono ${isActive ? 'text-primary text-lg' : 'text-foreground'}`}>
      {time}
    </div>
    <div className="col-span-3 text-right font-medium font-mono text-[10px] text-muted-foreground">
      {endTime}
    </div>
  </div>
);

export default PrayerRow;
