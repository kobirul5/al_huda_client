import React from "react";

interface OtherTimeRowProps {
  name: string;
  time: string;
  isGreen?: boolean;
}

const OtherTimeRow: React.FC<OtherTimeRowProps> = ({ name, time, isGreen }) => (
  <div className="flex justify-between items-center px-8 py-5 bg-muted/20 rounded-2xl hover:bg-muted/30 transition-colors">
    <div className="flex items-center gap-4">
      <div className={`w-2 h-2 rounded-full ${isGreen ? 'bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]' : 'bg-muted-foreground'}`} />
      <span className={`text-lg font-bold ${isGreen ? 'text-primary' : 'text-foreground/80'}`}>{name}</span>
    </div>
    <div className={`text-xl font-mono font-bold ${isGreen ? 'text-primary' : 'text-muted-foreground'}`}>{time}</div>
  </div>
);

export default OtherTimeRow;
