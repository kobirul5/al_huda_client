import React from "react";

interface PrayerRowProps {
  name: string;
  time: string;
  endTime: string;
  isActive: boolean;
  icon: React.ReactNode;
}

const PrayerRow: React.FC<PrayerRowProps> = ({ name, time, endTime, isActive, icon }) => (
  <div className={`grid grid-cols-12 items-center px-6 py-5 rounded-2xl transition-all duration-300 ${isActive ? 'bg-primary/10 border border-primary/20 shadow-lg' : 'hover:bg-white/5'}`}>
    <div className="col-span-6 flex items-center gap-4">
      <div className={`p-2 rounded-lg ${isActive ? 'bg-primary text-slate-900' : 'bg-slate-800 text-slate-400'}`}>
        {icon}
      </div>
      <span className={`text-xl font-bold ${isActive ? 'text-primary' : 'text-slate-300'}`}>{name}</span>
    </div>
    <div className={`col-span-3 text-right font-bold font-mono ${isActive ? 'text-primary text-xl' : 'text-slate-400'}`}>
      {time}
    </div>
    <div className="col-span-3 text-right font-medium font-mono text-slate-600">
      {endTime}
    </div>
  </div>
);

export default PrayerRow;
