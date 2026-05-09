import React from "react";

interface StaticRowProps {
  label: string;
  value: string;
}

const StaticRow: React.FC<StaticRowProps> = ({ label, value }) => (
  <div className="flex justify-between items-center py-2">
    <span className="text-lg font-bold text-foreground/80">{label}</span>
    <span className="text-base font-mono font-bold text-muted-foreground">{value}</span>
  </div>
);

export default StaticRow;
