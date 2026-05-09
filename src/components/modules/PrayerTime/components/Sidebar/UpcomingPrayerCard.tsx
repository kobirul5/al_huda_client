import React from "react";

interface UpcomingPrayerCardProps {
  name: string;
  timeLeft: string;
}

const UpcomingPrayerCard: React.FC<UpcomingPrayerCardProps> = ({ name, timeLeft }) => (
  <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] text-center shadow-2xl">
    <p className="text-slate-400 uppercase tracking-widest text-sm font-bold mb-4">Upcoming Prayer</p>
    <h2 className="text-6xl font-black text-primary mb-8 animate-pulse">
      {name}
    </h2>
    <div className="space-y-2">
      <p className="text-slate-400 font-medium">Upcoming Time</p>
      <div className="text-6xl md:text-7xl font-mono font-bold tracking-tighter text-white">
        {timeLeft}
      </div>
    </div>
  </div>
);

export default UpcomingPrayerCard;
