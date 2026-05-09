import React from "react";
import { Info, Clock } from "lucide-react";
import InfoRow from "../InfoRow";

interface PrayerInfoCardProps {
  method: string;
  timezone: string;
  date: string;
}

const PrayerInfoCard: React.FC<PrayerInfoCardProps> = ({ method, timezone, date }) => (
  <div className="bg-card border border-border p-8 rounded-[2rem] shadow-sm">
    <div className="flex items-center justify-between mb-6">
      <h3 className="font-bold flex items-center gap-2 text-foreground">
        <Info className="w-5 h-5 text-primary" /> Prayer Information
      </h3>
      <Clock className="w-5 h-5 text-muted-foreground" />
    </div>
    <div className="space-y-4">
      <InfoRow label="Calculation Method" value={method} />
      <InfoRow label="Time Zone" value={`${timezone} (UTC+6)`} />
      <InfoRow label="Today's Date" value={date} />
    </div>
  </div>
);

export default PrayerInfoCard;
