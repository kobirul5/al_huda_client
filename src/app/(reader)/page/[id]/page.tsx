import ReaderContent from "@/components/modules/quran-reader/ReaderContent";

export const dynamicParams = false;

export function generateStaticParams() {
  return Array.from({ length: 604 }, (_, index) => ({
    id: String(index + 1),
  }));
}

export default async function QuranPageRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <ReaderContent
      title={`Page ${id}`}
      subtitle="Quran page route is ready for page-based ayah data."
      verses={[]}
      emptyMessage="Page data is not available yet"
      previous={Number(id) > 1 ? { href: `/page/${Number(id) - 1}`, label: "Previous Page" } : undefined}
      next={Number(id) < 604 ? { href: `/page/${Number(id) + 1}`, label: "Next Page" } : undefined}
    />
  );
}
