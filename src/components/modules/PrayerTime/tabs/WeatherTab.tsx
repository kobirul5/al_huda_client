import React from "react";
import { Sun, CloudSun } from "lucide-react";
import WeatherStat from "../components/WeatherStat";
import { formatTime } from "../utils/prayerUtils";
import dayjs from "dayjs";

interface WeatherTabProps {
  weatherData: any;
  prayerData: any;
  location: { city: string; country: string };
}

const WeatherTab: React.FC<WeatherTabProps> = ({ weatherData, prayerData, location }) => {
  const currentW = weatherData?.current_condition?.[0];
  const forecast = weatherData?.weather || [];

  return (
    <div className="p-10">
      <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8">
        <div className="flex gap-4 items-center">
          <Sun className="w-12 h-12 text-yellow-500" />
          <div>
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-1">Today Weather in</p>
            <h3 className="text-3xl font-black text-foreground">{location.city}</h3>
          </div>
        </div>
        <div className="text-center md:text-right w-full md:w-auto">
          <div className="text-5xl md:text-6xl font-black text-foreground">{currentW?.temp_C || "32"}°</div>
          <div className="text-muted-foreground text-xs font-medium">High: {forecast[0]?.maxtempC || "33"}° | Low: {forecast[0]?.mintempC || "22"}°</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <WeatherStat label="Feels Like" value={`${currentW?.FeelsLikeC || "35"}°`} />
        <WeatherStat label="Wind" value={`${currentW?.windspeedMiles || "3"} mph`} />
        <WeatherStat label="Humidity" value={`${currentW?.humidity || "51"}%`} />
        <WeatherStat label="UV Index" value={`${currentW?.uvIndex || "6"} High`} />
        <WeatherStat label="Pressure" value={`${currentW?.pressure || "1006"} mb`} />
        <WeatherStat label="Visibility" value={`${currentW?.visibility || "16"} mi`} />
        <WeatherStat label="Sunrise" value={formatTime(prayerData.timings.Sunrise)} />
        <WeatherStat label="Sunset" value={formatTime(prayerData.timings.Sunset)} />
      </div>

      <div className="grid grid-cols-4 md:grid-cols-7 gap-4">
        {forecast.map((day: any, i: number) => (
          <div key={i} className={`p-4 rounded-2xl text-center border ${i === 0 ? 'bg-primary/10 border-primary/20' : 'bg-card border-transparent'}`}>
            <div className="text-xs text-slate-500 font-bold mb-2">{dayjs().add(i, 'day').format("ddd")}</div>
            <CloudSun className="w-8 h-8 mx-auto mb-3 text-slate-400" />
            <div className="text-sm font-bold text-foreground">{day.avgtempC}°</div>
            <div className="text-[10px] text-muted-foreground">{day.mintempC}°</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherTab;
