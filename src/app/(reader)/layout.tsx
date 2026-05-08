import QuranReaderShell from "@/components/modules/quran-reader/QuranReaderShell";
import { getSurahs } from "@/components/modules/quran-reader/reader-api";

export default async function ReaderLayout({ children }: { children: React.ReactNode }) {
  const surahs = await getSurahs();

  return <QuranReaderShell surahs={surahs}>{children}</QuranReaderShell>;
}
