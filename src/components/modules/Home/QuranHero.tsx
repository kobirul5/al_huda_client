import React from "react";
import { ISurah } from "./SurahCard";

interface QuranHeroProps {
  stats: {
    totalSurahs: number;
    totalVerses: number;
    meccanCount: number;
    medinanCount: number;
  };
}

const QuranHero: React.FC<QuranHeroProps> = ({ stats }) => {

  return (
    <section className="relative text-center px-6 pt-24 pb-20 overflow-hidden bg-[#0F172A]">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] px-5 py-2 rounded-full mb-8 bg-primary/10 border border-primary/20 text-primary shadow-sm backdrop-blur-sm">
          ✦ The Holy Quran
        </div>

        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 drop-shadow-xl font-amiri tracking-tight">
          القرآن الكريم
        </h1>

        <p className="max-w-xl mx-auto mt-4 mb-12 text-lg text-slate-400 font-medium leading-relaxed">
          Explore all 114 Surahs of the Al-Quran Al-Karim with ease and precision.
        </p>

        <div className="flex justify-center flex-wrap gap-6 md:gap-12">
          <StatBox label="Surahs" value={stats?.totalSurahs || 0} />
          <Divider />
          <StatBox label="Verses" value={(stats?.totalVerses || 0).toLocaleString()} />
          <Divider />
          <StatBox label="Meccan" value={stats?.meccanCount || 0} />
          <Divider />
          <StatBox label="Medinan" value={stats?.medinanCount || 0} />
        </div>
      </div>
    </section>
  );
};

const StatBox = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex flex-col items-center">
    <div className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-1">
      {value}
    </div>
    <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-500">
      {label}
    </div>
  </div>
);

const Divider = () => (
  <div className="hidden md:block w-px h-12 bg-slate-800 self-center" />
);

export default QuranHero;
