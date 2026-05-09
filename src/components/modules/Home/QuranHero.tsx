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
    <section
      className="relative text-center px-6 pt-32 pb-28 min-h-[80vh] flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/assets/banner.png')" }}
    >
      {/* Dark Overlay for contrast */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-30 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[120px]" />
      </div>

      <div className="relative container mx-auto px-4 z-10">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] px-5 py-2 rounded-full mb-8 bg-primary/20 border border-primary/30 text-white shadow-sm backdrop-blur-md">
          ✦ The Holy Quran
        </div>

        <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 drop-shadow-2xl font-amiri tracking-tight">
          القرآن الكريم
        </h1>

        <p className="max-w-2xl mx-auto mt-4 mb-12 text-lg md:text-xl text-slate-200 font-medium leading-relaxed drop-shadow-md">
          Explore all 114 Surahs of the Al-Quran Al-Karim with ease and precision.
        </p>

        <div className="flex justify-center flex-wrap gap-6 md:gap-12 bg-black/20 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
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
