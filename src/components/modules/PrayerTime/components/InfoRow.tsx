import React from "react";

interface InfoRowProps {
  label: string;
  value: string;
  color?: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, color = "text-foreground" }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-muted-foreground font-medium">{label}</span>
    <span className={`${color} font-semibold`}>{value}</span>
  </div>
);

export default InfoRow;
