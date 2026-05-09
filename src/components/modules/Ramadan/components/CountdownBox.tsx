import React from "react";

interface CountdownBoxProps {
  value: number;
  label: string;
}

const CountdownBox: React.FC<CountdownBoxProps> = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="w-16 h-16 md:w-20 md:h-20 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-black shadow-md">
      {value.toString().padStart(2, "0")}
    </div>
    <span className="mt-3 text-[9px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
  </div>
);

export default CountdownBox;
