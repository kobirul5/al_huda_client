import React from "react";
import { Moon } from "lucide-react";
import PrayerRow from "../components/PrayerRow";
import { prayerNames, formatTime, getEndTimeForPrayer } from "../utils/prayerUtils";
import { Sunrise, Sun, CloudSun, Sunset, Clock } from "lucide-react";

interface DailyPrayersTabProps {
  prayerData: any;
  location: { city: string; country: string };
  activePrayerName: string;
}

const getIconForPrayer = (name: string) => {
  switch (name) {
    case 'Fajr': return <Sunrise className="w-5 h-5" />;
    case 'Dhuhr': return <Sun className="w-5 h-5" />;
    case 'Asr': return <CloudSun className="w-5 h-5" />;
    case 'Maghrib': return <Sunset className="w-5 h-5" />;
    case 'Isha': return <Moon className="w-5 h-5" />;
    default: return <Clock className="w-5 h-5" />;
  }
};

const DailyPrayersTab: React.FC<DailyPrayersTabProps> = ({ prayerData, location, activePrayerName }) => {
  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-12">
        <div>
          <div className="bg-primary/20 p-3 rounded-xl w-fit mb-3">
            <Moon className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-1">Today Namaz Times in</p>
          <h3 className="text-2xl md:text-3xl font-black text-foreground">{location.city}, {location.country}</h3>
        </div>
        <div className="text-right">
          <div className="text-4xl font-black mb-1 text-foreground">{prayerData.date.hijri.day}</div>
          <div className="text-muted-foreground text-xs font-bold uppercase tracking-widest">{prayerData.date.hijri.month.en}</div>
          <div className="text-muted-foreground text-[10px] font-medium">{prayerData.date.hijri.year} AH</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-12 px-6 py-2 text-muted-foreground text-xs font-bold uppercase tracking-widest">
          <div className="col-span-6">Prayer</div>
          <div className="col-span-3 text-right">Start</div>
          <div className="col-span-3 text-right">End</div>
        </div>
        {prayerNames.map((name) => (
          <PrayerRow
            key={name}
            name={name}
            time={formatTime(prayerData.timings[name])}
            endTime={getEndTimeForPrayer(name, prayerData.timings)}
            isActive={activePrayerName === name}
            icon={getIconForPrayer(name)}
          />
        ))}
      </div>
    </div>
  );
};

export default DailyPrayersTab;
