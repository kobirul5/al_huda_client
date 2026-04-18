"use client";

import { useState } from "react";
import { LogOut, LucideLoader2 } from "lucide-react";
import { logoutUser } from "@/services/auth/logout";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="mt-6 w-full gap-2 rounded-2xl border-red-200 bg-red-50/50 font-semibold text-red-600 transition-all hover:bg-red-50 hover:text-red-700 hover:border-red-300 active:scale-[0.98]"
      onClick={handleLogout}
      disabled={loading}
    >
      {loading ? (
        <LucideLoader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
      {loading ? "Logging out..." : "Logout"}
    </Button>
  );
}
