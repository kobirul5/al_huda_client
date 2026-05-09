import React from "react";

interface UpcomingPrayerCardProps {
  name: string;
  timeLeft: string;
}

const UpcomingPrayerCard: React.FC<UpcomingPrayerCardProps> = ({ name, timeLeft }) => (
  <div className="bg-card border border-border p-10 rounded-[2.5rem] text-center shadow-sm">
    <p className="text-muted-foreground uppercase tracking-widest text-sm font-bold mb-4">Upcoming Prayer</p>
    <h2 className="text-6xl font-black text-primary mb-8 animate-pulse">
      {name}
    </h2>
    <div className="space-y-2">
      <p className="text-muted-foreground font-medium">Upcoming Time</p>
      <div className="text-6xl md:text-7xl font-mono font-bold tracking-tighter text-foreground">
        {timeLeft}
      </div>
    </div>
  </div>
);

export default UpcomingPrayerCard;
