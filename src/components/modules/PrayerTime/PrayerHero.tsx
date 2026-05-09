"use client";

import React, { useState } from "react";
import { MapPin, Clock, Sun, CloudSun } from "lucide-react";
import { formatTime } from "./utils/prayerUtils";
import { usePrayerLogic } from "./hooks/usePrayerLogic";

// Components
import TabButton from "./components/TabButton";
import UpcomingPrayerCard from "./components/Sidebar/UpcomingPrayerCard";
import PrayerInfoCard from "./components/Sidebar/PrayerInfoCard";
import ForbiddenTimesCard from "./components/Sidebar/ForbiddenTimesCard";

// Tabs
import DailyPrayersTab from "./tabs/DailyPrayersTab";
import OtherTimesTab from "./tabs/OtherTimesTab";
import CurrentTimeTab from "./tabs/CurrentTimeTab";
import WeatherTab from "./tabs/WeatherTab";

interface PrayerHeroProps {
  data: any;
  location?: { city: string; country: string };
}

const PrayerHero: React.FC<PrayerHeroProps> = ({ 
  data, 
  location = { city: "Dhaka", country: "Bangladesh" } 
}) => {
  const [activeTab, setActiveTab] = useState<"daily" | "other" | "current" | "weather">("daily");
  
  const prayerData = data?.prayer || data;
  const weatherData = data?.weather;

  const { currentTime, nextPrayer, timeLeft } = usePrayerLogic(prayerData);

  if (!prayerData || !prayerData.date) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Clock className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted-foreground font-medium">Loading prayer data...</p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    const commonProps = { prayerData, location };
    
    switch (activeTab) {
      case "daily":
        return <DailyPrayersTab {...commonProps} activePrayerName={nextPrayer?.name || ""} />;
      case "other":
        return <OtherTimesTab {...commonProps} />;
      case "current":
        return <CurrentTimeTab {...commonProps} currentTime={currentTime} />;
      case "weather":
        return <WeatherTab {...commonProps} weatherData={weatherData} />;
      default:
        return null;
    }
  };

  return (
    <section className="relative min-h-screen bg-background text-foreground overflow-hidden py-20 px-6">
      {/* Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative container mx-auto z-10">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            Islamic Prayer Times in {location.city} <MapPin className="inline-block w-8 h-8 text-primary ml-2" />
          </h1>
          <div className="flex flex-col items-center gap-2">
            <p className="text-muted-foreground flex items-center gap-2">
              Location: <span className="text-foreground font-medium">{location.city}, {location.country}</span>
              <button className="text-primary hover:underline text-sm font-semibold ml-1">(Change)</button>
            </p>
            <p className="text-muted-foreground font-medium">{prayerData.date.readable}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column - Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            <UpcomingPrayerCard 
              name={nextPrayer?.name || "Fajr"} 
              timeLeft={timeLeft} 
            />
            
            <PrayerInfoCard 
              method={prayerData.meta.method.name}
              timezone={prayerData.meta.timezone}
              date={prayerData.date.readable}
            />

            <ForbiddenTimesCard 
              sunrise={prayerData.timings.Sunrise}
              sunset={prayerData.timings.Sunset}
              formatTime={formatTime}
            />
          </aside>

          {/* Right Column - Main Content Area with Tabs */}
          <main className="lg:col-span-8 bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
            <nav className="flex border-b border-border px-8 pt-6 overflow-x-auto no-scrollbar">
              <TabButton 
                label="Daily Prayers" 
                icon={<Clock className="w-4 h-4" />} 
                isActive={activeTab === "daily"} 
                onClick={() => setActiveTab("daily")} 
              />
              <TabButton 
                label="Other Times" 
                icon={<Sun className="w-4 h-4" />} 
                isActive={activeTab === "other"} 
                onClick={() => setActiveTab("other")} 
              />
              <TabButton 
                label="Current Time" 
                icon={<Clock className="w-4 h-4" />} 
                isActive={activeTab === "current"} 
                onClick={() => setActiveTab("current")} 
              />
              <TabButton 
                label="Weather" 
                icon={<CloudSun className="w-4 h-4" />} 
                isActive={activeTab === "weather"} 
                onClick={() => setActiveTab("weather")} 
              />
            </nav>

            <div className="transition-all duration-500">
              {renderTabContent()}
            </div>
          </main>
        </div>
      </div>
    </section>
  );
};

export default PrayerHero;
