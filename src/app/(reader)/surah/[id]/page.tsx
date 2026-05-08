import ReaderContent from "@/components/modules/quran-reader/ReaderContent";
import { getSurahDetail } from "@/components/modules/quran-reader/reader-api";

export const dynamicParams = false;

export function generateStaticParams() {
  return Array.from({ length: 114 }, (_, index) => ({
    id: String(index + 1),
  }));
}

export default async function SurahPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const surah = await getSurahDetail(id);

  return (
    <ReaderContent
      title={surah.transliteration}
      subtitle={`Ayah-${surah.total_verses}, ${surah.type}`}
      verses={surah.verses}
      previous={surah.id > 1 ? { href: `/surah/${surah.id - 1}`, label: "Previous Surah" } : undefined}
      next={surah.id < 114 ? { href: `/surah/${surah.id + 1}`, label: "Next Surah" } : undefined}
    />
  );
}
