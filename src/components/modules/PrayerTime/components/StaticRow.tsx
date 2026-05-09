import React from "react";

interface StaticRowProps {
  label: string;
  value: string;
}

const StaticRow: React.FC<StaticRowProps> = ({ label, value }) => (
  <div className="flex justify-between items-center py-2">
    <span className="text-xl font-bold text-slate-300">{label}</span>
    <span className="text-xl font-mono font-bold text-slate-400">{value}</span>
  </div>
);

export default StaticRow;
