import PrayerHero from "@/components/modules/PrayerTime/PrayerHero";

async function getPrayerTimeData(city: string = "Dhaka", country: string = "Bangladesh") {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  try {
    const res = await fetch(`${apiUrl}/prayer-time?city=${city}&country=${country}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch prayer times: ${res.status}`);
    }

    const jsonResponse = await res.json();
    return jsonResponse.data;
  } catch (error) {
    console.error("Error fetching prayer times:", error);
    return null;
  }
}

export default async function PrayerTimePage() {
  const prayerData = await getPrayerTimeData();

  if (!prayerData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0F1C] text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Unable to load prayer times</h1>
          <p className="text-slate-400">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PrayerHero data={prayerData} />
    </div>
  );
}
