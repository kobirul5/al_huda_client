import React from "react";
import { Sun } from "lucide-react";
import OtherTimeRow from "../components/OtherTimeRow";
import { formatTime } from "../utils/prayerUtils";
import dayjs from "dayjs";

interface OtherTimesTabProps {
  prayerData: any;
  location: { city: string; country: string };
}

const OtherTimesTab: React.FC<OtherTimesTabProps> = ({ prayerData, location }) => {
  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-12">
        <div>
          <div className="bg-primary/20 p-4 rounded-2xl w-fit mb-4">
            <Sun className="w-10 h-10 text-primary" />
          </div>
          <p className="text-slate-400 text-sm font-medium mb-1">Nafl Namaz Times in</p>
          <h3 className="text-4xl font-bold">{location.city}, {location.country}</h3>
        </div>
        <div className="text-right">
          <div className="text-6xl font-bold mb-1">{prayerData.date.hijri.day}</div>
          <div className="text-slate-400 font-medium">{prayerData.date.hijri.month.en}</div>
          <div className="text-slate-500 text-sm">{prayerData.date.hijri.year} AH</div>
        </div>
      </div>
      <div className="space-y-4">
        <OtherTimeRow name="Sehri" time={formatTime(prayerData.timings.Imsak)} />
        <OtherTimeRow name="Iftar" time={formatTime(prayerData.timings.Maghrib)} isGreen />
        <OtherTimeRow name="Tahajjud" time={`${formatTime(prayerData.timings.Midnight)} - ${formatTime(prayerData.timings.Fajr)}`} />
        <OtherTimeRow name="Ishraq" time={`${dayjs(prayerData.timings.Sunrise, "HH:mm").add(15, "minute").format("hh:mm A")} - ${dayjs(prayerData.timings.Sunrise, "HH:mm").add(30, "minute").format("hh:mm A")}`} />
        <OtherTimeRow name="Salatul Duha" time={`07:32 AM - ${dayjs(prayerData.timings.Dhuhr, "HH:mm").subtract(20, "minute").format("hh:mm A")}`} />
      </div>
    </div>
  );
};

export default OtherTimesTab;
