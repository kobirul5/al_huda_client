import RamadanHero from "@/components/modules/Ramadan/RamadanHero";
import VirtuesSection from "@/components/modules/Ramadan/VirtuesSection";
import RamadanFAQ from "@/components/modules/Ramadan/RamadanFAQ";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

async function getRamadanData() {
  const city = "Dhaka";
  const country = "Bangladesh";

  try {
    const res = await fetch(`${apiUrl}/prayer-time?city=${city}&country=${country}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;

    const jsonResponse = await res.json();
    return jsonResponse.data;
  } catch (error) {
    console.error("Failed to fetch ramadan data:", error);
    return null;
  }
}

export default async function RamadanPage() {
  const ramadanData = await getRamadanData();

  if (!ramadanData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-foreground text-xl font-medium">Unable to load Ramadan data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <RamadanHero data={ramadanData} />
      <VirtuesSection />
      <RamadanFAQ />
    </div>
  );
}
