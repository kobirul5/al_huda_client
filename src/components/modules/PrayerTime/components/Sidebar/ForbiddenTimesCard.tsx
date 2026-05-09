import React from "react";
import { Sun } from "lucide-react";
import InfoRow from "../InfoRow";
import dayjs from "dayjs";

interface ForbiddenTimesCardProps {
  sunrise: string;
  sunset: string;
  formatTime: (time: string) => string;
}

const ForbiddenTimesCard: React.FC<ForbiddenTimesCardProps> = ({ sunrise, sunset, formatTime }) => (
  <div className="bg-red-950/20 backdrop-blur-md border border-red-900/20 p-8 rounded-[2rem]">
    <h3 className="font-bold text-red-400 mb-6 flex items-center gap-2">
      <Sun className="w-5 h-5" /> Forbidden Prayer Times
    </h3>
    <div className="space-y-4">
      <InfoRow 
        label="After Sunrise" 
        value={`${formatTime(sunrise)} - ${dayjs(sunrise, "HH:mm").add(15, 'minute').format("hh:mm A")}`} 
        color="text-red-300" 
      />
      <InfoRow label="Zawal" value="11:50 AM - 11:56 AM" color="text-red-300" />
      <InfoRow label="Before Sunset" value="06:17 PM - 06:31 PM" color="text-red-300" />
    </div>
  </div>
);

export default ForbiddenTimesCard;
