import React from "react";

interface WeatherStatProps {
  label: string;
  value: string;
}

const WeatherStat: React.FC<WeatherStatProps> = ({ label, value }) => (
  <div>
    <p className="text-muted-foreground text-sm font-medium mb-1">{label}</p>
    <p className="text-xl font-bold text-foreground">{value}</p>
  </div>
);

export default WeatherStat;
