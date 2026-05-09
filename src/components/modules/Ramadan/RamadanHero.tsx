"use client";

import React, { useState, useEffect } from "react";
import { Timer, MapPin, Calendar, Sun, Moon, Info } from "lucide-react";
import { useRamadanCountdown } from "./hooks/useRamadanCountdown";
import CountdownBox from "./components/CountdownBox";
import DuaCard from "./components/DuaCard";

interface RamadanHeroProps {
  data: any;
  location?: { city: string; country: string };
}

const RamadanHero: React.FC<RamadanHeroProps> = ({ 
  data, 
  location = { city: "Dhaka", country: "Bangladesh" } 
}) => {
  const prayerData = data?.prayer || data;
  
  // Ramadan start date - Dynamic for the next year
  const timeLeft = useRamadanCountdown("2026-03-01");

  if (!prayerData || !prayerData.date) return null;

  return (
    <section 
      className="relative min-h-[90vh] flex flex-col items-center justify-center py-20 px-6 overflow-hidden"
      style={{
        backgroundImage: 'url("/assets/banner.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay to ensure text readability without being "dark theme" */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />

      <div className="relative z-10 max-w-4xl w-full text-center">
        {/* Title Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-3">
             <Moon className="w-8 h-8 text-primary fill-primary/20" />
             <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
               Ramadan Mubarak 2026
             </h1>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground font-semibold uppercase tracking-widest text-[10px]">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-primary" /> {location.city}, {location.country}</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-primary" /> {prayerData.date.hijri.day} {prayerData.date.hijri.month.en} {prayerData.date.hijri.year}</span>
          </div>
        </div>

        {/* Countdown Section */}
        <div className="bg-card/80 backdrop-blur-xl border border-primary/20 rounded-2xl p-6 mb-8 shadow-lg shadow-primary/5">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Timer className="w-5 h-5 text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground">Ramadan Countdown</h2>
          </div>
          
          <div className="flex justify-center gap-3 md:gap-6">
            <CountdownBox value={timeLeft.days} label="Days" />
            <span className="text-3xl font-bold text-primary self-center pb-6">:</span>
            <CountdownBox value={timeLeft.hours} label="Hours" />
            <span className="text-3xl font-bold text-primary self-center pb-6">:</span>
            <CountdownBox value={timeLeft.minutes} label="Mins" />
            <span className="text-3xl font-bold text-primary self-center pb-6">:</span>
            <CountdownBox value={timeLeft.seconds} label="Secs" />
          </div>
        </div>

        {/* Sehri & Iftar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Sehri Card */}
          <DuaCard 
            type="Sehri"
            time={prayerData.timings.Imsak}
            location={location.city}
            icon={<Sun className="w-6 h-6 text-amber-500" />}
            arabic="وَبِصَوْمِ غَدٍ نَّوَيْتُ مِنْ شَهْرِ رَمَضَانَ"
            translation="I intend to keep the fast for tomorrow in the month of Ramadan"
          />

          {/* Iftar Card */}
          <DuaCard 
            type="Iftar"
            time={prayerData.timings.Maghrib}
            location={location.city}
            icon={<Moon className="w-6 h-6 text-emerald-500" />}
            arabic="اللَّهُمَّ اِنِّى لَكَ صُمْتُ وَبِكَ اَمَنْتُ وَعَلَيْكَ تَوَكَّلْتُ وَعَلَى رِزْقِكَ اَفْطَرْتُ"
            translation="O Allah, I fasted for You and I believe in You and I break my fast with Your sustenance"
          />
        </div>
      </div>
    </section>
  );
};

export default RamadanHero;
