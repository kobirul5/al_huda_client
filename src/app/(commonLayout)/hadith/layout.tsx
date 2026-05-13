import HadithSidebar from "@/components/modules/hadith/HadithSidebar";

export default function HadithLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto min-h-[calc(100vh-24rem)] px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <HadithSidebar />
          </div>
        </aside>

        <main className="lg:col-span-3">{children}</main>
      </div>
    </div>
  );
}
