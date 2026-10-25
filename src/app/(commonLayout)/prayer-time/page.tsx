import PrayerHero from "@/components/modules/PrayerTime/PrayerHero";

const FETCH_TIMEOUT = 5000; // reduced from 8s → 5s
const MAX_RETRIES = 1;    // reduced from 2 → 1
const RETRY_DELAY = 500;  // reduced from 1s → 500ms

function isLocalhostApiInProduction(url: string) {
  return process.env.NODE_ENV === "production" && /^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(url);
}

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  const cityParam = encodeURIComponent(city);
  const countryParam = encodeURIComponent(country);
  const url = `${apiUrl}/prayer-time?city=${cityParam}&country=${countryParam}`;
  const fallbackUrl = `https://api.aladhan.com/v1/timingsByCity?city=${cityParam}&country=${countryParam}&method=1`;

  try {
    // ─── Backend + fallback run in parallel; first valid result wins ──────────
    const backendFetch = isLocalhostApiInProduction(apiUrl)
      ? Promise.resolve(null)
      : retryFetch(url).then(async (res) => {
          if (!res) return null;
          const json = await res.json();
          return json.success && json.data ? json.data : null;
        }).catch(() => null);

    const directFetch = retryFetch(fallbackUrl, 0).then(async (res) => {
      if (!res) return null;
      const json = await res.json();
      if (json.code !== 200 || !json.data) return null;
      return { prayer: json.data, weather: null };
    }).catch(() => null);

    // Wait for backend first (it includes weather); if it takes too long, use direct
    const backendResult = await backendFetch;
    if (backendResult) return backendResult;

    console.warn("Backend prayer-time API failed, using direct fallback", { city, country });
    const directResult = await directFetch;
    if (directResult) return directResult;

    console.error("Both prayer-time sources failed", { city, country });
    return null;
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
