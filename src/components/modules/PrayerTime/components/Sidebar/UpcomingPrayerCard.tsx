import React from "react";
import { cn } from "@/lib/utils";

interface UpcomingPrayerCardProps {
  name: string;
  timeLeft: string;
}

const UpcomingPrayerCard: React.FC<UpcomingPrayerCardProps & { className?: string }> = ({ name, timeLeft, className }) => (
  <div className={cn("bg-card border border-border p-8 rounded-2xl text-center shadow-sm", className)}>
    <p className="text-muted-foreground uppercase tracking-widest text-xs font-bold mb-2">Upcoming Prayer</p>
    <h2 className="text-4xl md:text-5xl font-black text-primary mb-6 animate-pulse">
      {name}
    </h2>
    <div className="space-y-2">
      <p className="text-muted-foreground text-sm font-medium">Time Remaining</p>
      <div className="text-5xl md:text-6xl font-mono font-bold tracking-tighter text-foreground">
        {timeLeft}
      </div>
    </div>
  </div>
);

export default UpcomingPrayerCard;
