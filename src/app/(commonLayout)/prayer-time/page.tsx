import PrayerHero from "@/components/modules/PrayerTime/PrayerHero";

const FETCH_TIMEOUT = 15000; // 15 seconds
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second

async function retryFetch(
  url: string,
  maxRetries: number = MAX_RETRIES
): Promise<Response | null> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

      try {
        const res = await fetch(url, {
          signal: controller.signal,
          next: { revalidate: 3600 },
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          return res;
        }

        // If response is not OK, don't retry for client errors (4xx)
        if (res.status >= 400 && res.status < 500) {
          throw new Error(`Client error: ${res.status}`);
        }

        lastError = new Error(`Server error: ${res.status}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        clearTimeout(timeoutId);

        if (err.name === 'AbortError') {
          lastError = new Error('Request timeout');
        } else {
          lastError = err instanceof Error ? err : new Error(String(err));
        }
      }

      // Retry on network errors and server errors only
      if (attempt < maxRetries) {
        const waitTime = RETRY_DELAY * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  return null;
}

async function getPrayerTimeData(
  city: string = "Dhaka",
  country: string = "Bangladesh"
) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
  const url = `${apiUrl}/prayer-time?city=${encodeURIComponent(city)}&country=${encodeURIComponent(
    country
  )}`;

  try {
    const res = await retryFetch(url);

    if (!res) {
      console.error("Failed to fetch prayer times after retries", { city, country });
      return null;
    }

    const jsonResponse = await res.json();

    if (!jsonResponse.success || !jsonResponse.data) {
      console.error("Invalid prayer times response", { jsonResponse });
      return null;
    }

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
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Unable to load prayer times</h1>
          <p className="text-muted-foreground mb-6">
            We&apos;re experiencing temporary difficulties loading prayer times. Please try again later.
          </p>
          <div className="text-xs text-gray-500">
            <p>If this problem persists, please contact support.</p>
          </div>
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
