import React from "react";
import { Sun } from "lucide-react";
import InfoRow from "../InfoRow";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";

interface ForbiddenTimesCardProps {
  sunrise: string;
  sunset: string;
  formatTime: (time: string) => string;
}

const ForbiddenTimesCard: React.FC<ForbiddenTimesCardProps & { className?: string }> = ({ sunrise, sunset, formatTime, className }) => (
  <div className={cn("bg-destructive/10 border border-destructive/20 p-8 rounded-2xl shadow-sm", className)}>
    <h3 className="font-bold text-destructive mb-6 flex items-center gap-2">
      <Sun className="w-5 h-5" /> Forbidden Prayer Times
    </h3>
    <div className="space-y-4">
      <InfoRow 
        label="After Sunrise" 
        value={`${formatTime(sunrise)} - ${dayjs(sunrise, "HH:mm").add(15, 'minute').format("hh:mm A")}`} 
        color="text-destructive" 
      />
      <InfoRow label="Zawal" value="11:50 AM - 11:56 AM" color="text-destructive" />
      <InfoRow label="Before Sunset" value="06:17 PM - 06:31 PM" color="text-destructive" />
    </div>
  </div>
);

export default ForbiddenTimesCard;
