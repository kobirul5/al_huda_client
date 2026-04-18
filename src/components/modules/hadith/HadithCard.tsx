"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Bookmark, Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HadithCardProps {
  hadith: {
    number: number;
    arabic: string;
    english: string;
    bangla: string;
  };
}

export default function HadithCard({ hadith }: HadithCardProps) {
  return (
    <Card className="mb-6 overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {hadith.number}
          </span>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Arabic Text */}
          <div className="text-right">
            <p className="text-2xl font-semibold leading-loose text-slate-800" dir="rtl">
              {hadith.arabic}
            </p>
          </div>

          {/* Bangla Translation */}
          <div className="rounded-lg bg-primary/5 p-4 border-l-4 border-primary/30">
            <p className="text-sm font-medium text-primary/70 mb-1 uppercase tracking-wider">Bangla</p>
            <p className="text-lg text-slate-700 leading-relaxed">{hadith.bangla}</p>
          </div>

          {/* English Translation */}
          <div className="rounded-lg bg-slate-50 p-4 border-l-4 border-slate-200">
            <p className="text-sm font-medium text-slate-400 mb-1 uppercase tracking-wider">English</p>
            <p className="text-base text-slate-600 italic leading-relaxed">{hadith.english}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
