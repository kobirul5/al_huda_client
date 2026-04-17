"use client";

interface AyahSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
}

export default function AyahSearchBar({ value, onChange, resultCount }: AyahSearchBarProps) {
  return (
    <div className="space-y-3">
      <label htmlFor="ayah-search" className="text-sm font-semibold text-foreground">
        Search Ayahs
      </label>
      <input
        id="ayah-search"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search Arabic, translation, or transliteration"
        className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary"
      />
      <p className="text-xs text-muted-foreground">
        {value.trim()
          ? `${resultCount} ayah${resultCount === 1 ? "" : "s"} matched your search`
          : "Search by Arabic text, translation, or transliteration"}
      </p>
    </div>
  );
}
