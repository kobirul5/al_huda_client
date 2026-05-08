import QuranReaderShell from "@/components/modules/quran-reader/QuranReaderShell";
import { getPages, getParas, getSurahs } from "@/components/modules/quran-reader/reader-api";

export default async function ReaderLayout({ children }: { children: React.ReactNode }) {
  const [surahs, paras, pages] = await Promise.all([getSurahs(), getParas(), getPages()]);

  return (
    <QuranReaderShell surahs={surahs} paras={paras} pages={pages}>
      {children}
    </QuranReaderShell>
  );
}
