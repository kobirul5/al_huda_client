import React from "react";

interface CountdownBoxProps {
  value: number;
  label: string;
}

const CountdownBox: React.FC<CountdownBoxProps> = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="w-20 h-20 md:w-24 md:h-24 bg-primary text-primary-foreground rounded-3xl flex items-center justify-center text-3xl md:text-4xl font-black shadow-lg">
      {value.toString().padStart(2, "0")}
    </div>
    <span className="mt-4 text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
  </div>
);

export default CountdownBox;
