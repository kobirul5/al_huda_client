import QuranHero from "@/components/modules/Home/QuranHero";
import { ISurah } from "@/components/modules/Home/SurahCard";
import SurahList from "@/components/modules/Home/SurahList";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getSurahData(): Promise<{ surahs: ISurah[]; stats: any }> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
  
  try {
    const res = await fetch(`${apiUrl}/quran/surahs`, {
      next: { revalidate: 3600 }, // Cache and revalidate every hour
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch surahs: ${res.status}`);
    }

    const jsonResponse = await res.json();
    return {
      surahs: jsonResponse?.data || [],
      stats: jsonResponse?.stats || { totalSurahs: 0, totalVerses: 0, meccanCount: 0, medinanCount: 0 },
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
      
      <main className="container mx-auto">
        <SurahList initialSurahs={surahs} />
      </main>
    </div>
  );
}