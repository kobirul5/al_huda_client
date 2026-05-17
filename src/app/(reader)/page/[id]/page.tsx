import ReaderContent from "@/components/modules/quran-reader/ReaderContent";
import { getPageDetail } from "@/components/modules/quran-reader/reader-api";

export const dynamic = "force-dynamic";

export default async function QuranPageRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = await getPageDetail(id);
  const verses = page.surahs.flatMap((surah) =>
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
      title={`Page ${page.id}`}
      subtitle={`${page.total_verses} Ayah, Surah ${page.start.surah}:${page.start.ayah} - ${page.end.surah}:${page.end.ayah}`}
      verses={verses}
      previous={page.id > 1 ? { href: `/page/${page.id - 1}`, label: "Previous Page" } : undefined}
      next={page.id < 604 ? { href: `/page/${page.id + 1}`, label: "Next Page" } : undefined}
    />
  );
}
