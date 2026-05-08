import QuranReaderShell from "@/components/modules/quran-reader/QuranReaderShell";
import { getParas, getSurahs } from "@/components/modules/quran-reader/reader-api";

export default async function ReaderLayout({ children }: { children: React.ReactNode }) {
  const [surahs, paras] = await Promise.all([getSurahs(), getParas()]);

  return (
    <QuranReaderShell surahs={surahs} paras={paras}>
      {children}
    </QuranReaderShell>
  );
}
