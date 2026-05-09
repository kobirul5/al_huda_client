import React from "react";

interface OtherTimeRowProps {
  name: string;
  time: string;
  isGreen?: boolean;
}

const OtherTimeRow: React.FC<OtherTimeRowProps> = ({ name, time, isGreen }) => (
  <div className="flex justify-between items-center px-8 py-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
    <div className="flex items-center gap-4">
      <div className={`w-2 h-2 rounded-full ${isGreen ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-600'}`} />
      <span className={`text-xl font-bold ${isGreen ? 'text-emerald-500' : 'text-slate-300'}`}>{name}</span>
    </div>
    <div className={`text-2xl font-mono font-bold ${isGreen ? 'text-emerald-500' : 'text-slate-400'}`}>{time}</div>
  </div>
);

export default OtherTimeRow;
