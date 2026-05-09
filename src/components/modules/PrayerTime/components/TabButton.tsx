import React from "react";

interface TabButtonProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, icon, isActive, onClick }) => (
  <div
    className={`px-8 pb-4 font-medium flex items-center gap-2 cursor-pointer transition-all duration-300 whitespace-nowrap ${isActive ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
    onClick={onClick}
  >
    {icon} {label}
  </div>
);

export default TabButton;
