"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Info,
  Calendar,
  CloudSun,
} from "lucide-react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
  Firstthird: string;
  Lastthird: string;
}

interface PrayerHeroProps {
  data: {
    timings: PrayerTimes;
    date: {
      readable: string;
      hijri: {
        date: string;
        day: string;
        month: { en: string };
        year: string;
        designation: { abbreviated: string };
      };
    };
    meta: {
      timezone: string;
      method: { name: string };
    };
  };
  location?: {
    city: string;
    country: string;
  };
}

const PrayerHero: React.FC<PrayerHeroProps> = ({ data, location = { city: "Dhaka", country: "Bangladesh" } }) => {
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: dayjs.Dayjs } | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");

  const prayerNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const findNextPrayer = () => {
      const now = dayjs();
      let next = null;

      for (const name of prayerNames) {
        const timeStr = data.timings[name as keyof PrayerTimes];
        const [hours, minutes] = timeStr.split(":").map(Number);
        const prayerTime = dayjs().hour(hours).minute(minutes).second(0);

        if (prayerTime.isAfter(now)) {
          next = { name, time: prayerTime };
          break;
        }
      }

      if (!next) {
        // If all prayers today passed, the next is Fajr tomorrow
        const timeStr = data.timings.Fajr;
        const [hours, minutes] = timeStr.split(":").map(Number);
        const prayerTime = dayjs().add(1, "day").hour(hours).minute(minutes).second(0);
        next = { name: "Fajr", time: prayerTime };
      }

      setNextPrayer(next);
    };

    findNextPrayer();
    const interval = setInterval(findNextPrayer, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [data, currentTime]);

  useEffect(() => {
    if (nextPrayer) {
      const diff = nextPrayer.time.diff(currentTime);
      const dur = dayjs.duration(diff);
      const hours = Math.floor(dur.asHours());
      const mins = dur.minutes();
      const secs = dur.seconds();
      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${mins
          .toString()
          .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
      );
    }
  }, [nextPrayer, currentTime]);

  const getActivePrayerName = () => {
    return nextPrayer?.name || "Fajr";
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return dayjs().hour(hours).minute(minutes).format("hh:mm A");
  };

  return (
    <section className="relative min-h-screen bg-[#0A0F1C] text-white overflow-hidden py-20 px-6">
      {/* Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative container mx-auto z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            Islamic Prayer Times in {location.city} <MapPin className="inline-block w-8 h-8 text-primary ml-2" />
          </h1>
          <div className="flex flex-col items-center gap-2">
            <p className="text-slate-400 flex items-center gap-2">
              Location: <span className="text-white font-medium">{location.city}, {location.country}</span> 
              <button className="text-primary hover:underline text-sm font-semibold ml-1">(Change)</button>
            </p>
            <p className="text-slate-500 font-medium">{data.date.readable}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column - Current Prayer Status */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] text-center shadow-2xl">
              <p className="text-slate-400 uppercase tracking-widest text-sm font-bold mb-4">Upcoming Prayer</p>
              <h2 className="text-6xl font-black text-primary mb-8 animate-pulse">
                {getActivePrayerName()}
              </h2>
              <div className="space-y-2">
                <p className="text-slate-400 font-medium">Upcoming Time</p>
                <div className="text-6xl md:text-7xl font-mono font-bold tracking-tighter text-white">
                  {timeLeft}
                </div>
              </div>
            </div>

            {/* Prayer Information */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 p-8 rounded-[2rem]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" /> Prayer Information
                </h3>
                <Clock className="w-5 h-5 text-slate-500" />
              </div>
              <div className="space-y-4">
                <InfoRow label="Calculation Method" value={data.meta.method.name} />
                <InfoRow label="Time Zone" value={`${data.meta.timezone} (UTC+6)`} />
                <InfoRow label="Today's Date" value={data.date.readable} />
              </div>
            </div>

            {/* Forbidden Prayer Times */}
            <div className="bg-red-950/20 backdrop-blur-md border border-red-900/20 p-8 rounded-[2rem]">
              <h3 className="font-bold text-red-400 mb-6 flex items-center gap-2">
                <Sun className="w-5 h-5" /> Forbidden Prayer Times
              </h3>
              <div className="space-y-4">
                <InfoRow label="After Sunrise" value={`${formatTime(data.timings.Sunrise)} - ${dayjs(data.timings.Sunrise, "HH:mm").add(15, 'minute').format("hh:mm A")}`} color="text-red-300" />
                <InfoRow label="Zawal" value="11:50 AM - 11:56 AM" color="text-red-300" />
                <InfoRow label="Before Sunset" value="06:17 PM - 06:31 PM" color="text-red-300" />
              </div>
            </div>
          </div>

          {/* Right Column - Main Table & Daily Details */}
          <div className="lg:col-span-8 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
            {/* Tabs Style Header */}
            <div className="flex border-b border-white/5 px-8 pt-6">
              <div className="border-b-2 border-primary px-4 pb-4 font-bold text-primary flex items-center gap-2">
                <Clock className="w-4 h-4" /> Daily Prayers
              </div>
              <div className="px-8 pb-4 font-medium text-slate-500 flex items-center gap-2 cursor-pointer hover:text-slate-300">
                <Sun className="w-4 h-4" /> Other Times
              </div>
              <div className="px-8 pb-4 font-medium text-slate-500 flex items-center gap-2 cursor-pointer hover:text-slate-300">
                <Clock className="w-4 h-4" /> Current Time
              </div>
              <div className="px-8 pb-4 font-medium text-slate-500 flex items-center gap-2 cursor-pointer hover:text-slate-300">
                <CloudSun className="w-4 h-4" /> Weather
              </div>
            </div>

            <div className="p-10">
              {/* City Info Card */}
              <div className="flex justify-between items-center mb-12">
                <div>
                  <div className="bg-primary/20 p-4 rounded-2xl w-fit mb-4">
                    <Moon className="w-10 h-10 text-primary" />
                  </div>
                  <p className="text-slate-400 text-sm font-medium mb-1">Today Namaz Times in</p>
                  <h3 className="text-4xl font-bold">{location.city}, {location.country}</h3>
                </div>
                <div className="text-right">
                  <div className="text-6xl font-bold mb-1">{data.date.hijri.day}</div>
                  <div className="text-slate-400 font-medium">{data.date.hijri.month.en}</div>
                  <div className="text-slate-500 text-sm">{data.date.hijri.year} AH</div>
                </div>
              </div>

              {/* Prayer Times Table */}
              <div className="space-y-2">
                <div className="grid grid-cols-12 px-6 py-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
                  <div className="col-span-6">Prayer</div>
                  <div className="col-span-3 text-right">Start</div>
                  <div className="col-span-3 text-right">End</div>
                </div>
                
                {prayerNames.map((name) => (
                  <PrayerRow 
                    key={name}
                    name={name} 
                    time={formatTime(data.timings[name as keyof PrayerTimes])}
                    endTime={getEndTimeForPrayer(name, data.timings)}
                    isActive={getActivePrayerName() === name}
                    icon={getIconForPrayer(name)}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

const InfoRow = ({ label, value, color = "text-white" }: { label: string; value: string; color?: string }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-slate-500 font-medium">{label}</span>
    <span className={`${color} font-semibold`}>{value}</span>
  </div>
);

const PrayerRow = ({ name, time, endTime, isActive, icon }: { name: string; time: string; endTime: string; isActive: boolean; icon: React.ReactNode }) => (
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

const getEndTimeForPrayer = (name: string, timings: PrayerTimes) => {
    // Basic logic for end times based on the next prayer or sun events
    switch(name) {
        case 'Fajr': return timings.Sunrise;
        case 'Dhuhr': return timings.Asr;
        case 'Asr': return timings.Sunset;
        case 'Maghrib': return timings.Isha;
        case 'Isha': return timings.Fajr; // Roughly
        default: return "-";
    }
};

export default PrayerHero;
