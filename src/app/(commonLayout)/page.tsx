import QuranHero from "@/components/modules/Home/QuranHero";
import { ISurah } from "@/components/modules/Home/SurahCard";
import SurahList from "@/components/modules/Home/SurahList";
import DailyHadith from "@/components/modules/Home/DailyHadith";
import FeaturesSection from "@/components/modules/Home/FeaturesSection";
import { getSurahs } from "@/components/modules/quran-reader/reader-api";
import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getSurahData(): Promise<{ surahs: ISurah[]; stats: any }> {
  try {
    const surahs = await getSurahs();

    return {
      surahs,
      stats: {
        totalSurahs: surahs.length,
        totalVerses: surahs.reduce((total, surah) => total + surah.total_verses, 0),
        meccanCount: surahs.filter((surah) => surah.type === "meccan").length,
        medinanCount: surahs.filter((surah) => surah.type === "medinan").length,
      },
    };
  } catch (error) {
    console.error("Error fetching surahs:", error);
    return { surahs: [], stats: { totalSurahs: 0, totalVerses: 0, meccanCount: 0, medinanCount: 0 } };
  }
}

export default async function Home() {
  const { surahs, stats } = await getSurahData();

  return (
    <div className="min-h-screen bg-background">
      <QuranHero stats={stats} />

      
      <main id="surahs" className="scroll-mt-24 pb-20">
        <SurahList initialSurahs={surahs.slice(0, 20)} />
        
        {surahs.length > 20 && (
          <div className="text-center mt-10">
            <Link 
              href="/surah/1" 
              className="inline-flex items-center gap-2 px-10 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all"
            >
              View All Surahs
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14m-7-7 7 7-7 7"/>
              </svg>
            </Link>
          </div>
        )}
      </main>

      <FeaturesSection />
            <DailyHadith />
    </div>
  );
}
