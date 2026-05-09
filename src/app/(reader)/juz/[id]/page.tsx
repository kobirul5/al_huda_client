import ReaderContent from "@/components/modules/quran-reader/ReaderContent";
import { getParaDetail } from "@/components/modules/quran-reader/reader-api";

export const dynamicParams = true;

export function generateStaticParams() {
  return [{ id: "1" }];
}

export default async function JuzPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const juz = await getParaDetail(id);
  const verses = juz.surahs.flatMap((surah) =>
    surah.verses.map((verse, verseIndex) => ({
      ...verse,
      surahId: surah.id,
      surahName: surah.transliteration,
      surahArabicName: surah.name,
      showSurahHeading: verseIndex === 0,
      headingAnchorId: verseIndex === 0 ? `surah-${surah.id}-ayah-${surah.start_ayah}` : undefined,
    }))
  );

  return (
    <ReaderContent
      title={`Juz ${juz.id}`}
      subtitle={`${juz.total_verses} Ayah, Surah ${juz.start.surah}:${juz.start.ayah} - ${juz.end.surah}:${juz.end.ayah}`}
      verses={verses}
      previous={juz.id > 1 ? { href: `/juz/${juz.id - 1}`, label: "Previous Juz" } : undefined}
      next={juz.id < 30 ? { href: `/juz/${juz.id + 1}`, label: "Next Juz" } : undefined}
    />
  );
}
