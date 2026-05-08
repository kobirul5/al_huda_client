"use client";

import { BookOpen, ChevronDown, Type } from "lucide-react";
import { ReaderSettings } from "@/components/modules/surah/VerseCard";
import { useReaderSettings } from "./ReaderSettingsProvider";

const arabicFontOptions: Array<{
  value: ReaderSettings["arabicFont"];
  label: string;
}> = [
  { value: "amiri", label: "PDMS Islamic" },
  { value: "notoNaskh", label: "Noto Naskh Arabic" },
];

export default function ReaderSettingsPanel() {
  const { settings, setSettings } = useReaderSettings();

  return (
    <aside className="hidden min-h-0 border-l border-border bg-sidebar p-7 xl:block">
      <div className="mb-7 grid grid-cols-2 rounded-full bg-card p-1">
        <button className="rounded-full bg-background px-4 py-2 text-sm font-bold text-foreground">Translation</button>
        <button className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground">Reading</button>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between text-foreground">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-bold">Reading Settings</span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </div>

        <div className="flex items-center justify-between text-primary">
          <div className="flex items-center gap-3">
            <Type className="h-5 w-5" />
            <span className="text-sm font-bold">Font Settings</span>
          </div>
          <ChevronDown className="h-4 w-4 rotate-180" />
        </div>

        <div className="space-y-4">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label htmlFor="arabic-font-size" className="text-sm font-bold text-foreground">
                Arabic Font Size
              </label>
              <span className="text-sm font-bold text-primary">{settings.arabicFontSize}</span>
            </div>
            <input
              id="arabic-font-size"
              type="range"
              min="24"
              max="48"
              step="1"
              value={settings.arabicFontSize}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  arabicFontSize: Number(event.target.value),
                }))
              }
              className="w-full accent-primary"
            />
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <label htmlFor="translation-font-size" className="text-sm font-bold text-foreground">
                Translation Font Size
              </label>
              <span className="text-sm font-bold text-primary">{settings.translationFontSize}</span>
            </div>
            <input
              id="translation-font-size"
              type="range"
              min="14"
              max="24"
              step="1"
              value={settings.translationFontSize}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  translationFontSize: Number(event.target.value),
                }))
              }
              className="w-full accent-primary"
            />
          </div>

          <div>
            <label htmlFor="arabic-font" className="mb-3 block text-sm font-bold text-foreground">
              Arabic Font Face
            </label>
            <select
              id="arabic-font"
              value={settings.arabicFont}
              onChange={(event) =>
                setSettings((current) => ({
                  ...current,
                  arabicFont: event.target.value as ReaderSettings["arabicFont"],
                }))
              }
              className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground outline-none"
            >
              {arabicFontOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </aside>
  );
}
