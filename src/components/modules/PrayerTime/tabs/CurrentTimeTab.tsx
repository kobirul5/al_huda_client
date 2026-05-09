import React from "react";
import { Clock } from "lucide-react";
import StaticRow from "../components/StaticRow";
import { formatTime, getBanglaDate } from "../utils/prayerUtils";
import dayjs from "dayjs";

interface CurrentTimeTabProps {
  prayerData: any;
  location: { city: string; country: string };
  currentTime: dayjs.Dayjs;
}

const CurrentTimeTab: React.FC<CurrentTimeTabProps> = ({ prayerData, location, currentTime }) => {
  return (
    <div className="p-10">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
        <div className="bg-primary/20 p-6 rounded-3xl">
          <Clock className="w-12 h-12 text-primary" />
        </div>
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">Current Time in</p>
          <h3 className="text-4xl font-bold">{location.city}, {location.country}</h3>
        </div>
        <div className="md:ml-auto text-center md:text-right">
          <div className="text-6xl font-bold text-white">{currentTime.format("hh:mm A")}</div>
          <div className="text-slate-500 font-medium">{currentTime.format("MMMM DD, YYYY")}</div>
        </div>
      </div>
      <div className="space-y-6">
        <StaticRow label="Sunrise" value={formatTime(prayerData.timings.Sunrise)} />
        <StaticRow label="Sunset" value={formatTime(prayerData.timings.Sunset)} />
        <div className="h-px bg-white/5 my-4" />
        <StaticRow label="Gregorian Date" value={currentTime.format("MMMM DD, YYYY")} />
        <StaticRow label="Bangla Date" value={getBanglaDate()} />
        <StaticRow label="Arabic Date" value={`${prayerData.date.hijri.month.en} ${prayerData.date.hijri.day}, ${prayerData.date.hijri.year} AH`} />
      </div>
    </div>
  );
};

export default CurrentTimeTab;
