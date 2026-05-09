import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
  Firstthird: string;
  Lastthird: string;
}

export const prayerNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

export const formatTime = (timeStr: string) => {
  if (!timeStr) return "-";
  const [hours, minutes] = timeStr.split(":").map(Number);
  return dayjs().hour(hours).minute(minutes).format("hh:mm A");
};

export const getBanglaDate = () => {
  const bYear = dayjs().year() - 593;
  const bMonth = "বৈশাখের";
  return `${dayjs().format("dddd")}, ${dayjs().format("D")} ${bMonth} ${bYear} বঙ্গাব্দ`;
};

export const getEndTimeForPrayer = (name: string, timings: PrayerTimes) => {
  switch (name) {
    case 'Fajr': return timings.Sunrise;
    case 'Dhuhr': return timings.Asr;
    case 'Asr': return timings.Sunset;
    case 'Maghrib': return timings.Isha;
    case 'Isha': return timings.Fajr;
    default: return "-";
  }
};

export const findNextPrayer = (timings: PrayerTimes) => {
  const now = dayjs();
  let next = null;

  for (const name of prayerNames) {
    const timeStr = timings[name as keyof PrayerTimes];
    const [hours, minutes] = timeStr.split(":").map(Number);
    const prayerTime = dayjs().hour(hours).minute(minutes).second(0);

    if (prayerTime.isAfter(now)) {
      next = { name, time: prayerTime };
      break;
    }
  }

  if (!next) {
    const timeStr = timings.Fajr;
    const [hours, minutes] = timeStr.split(":").map(Number);
    const prayerTime = dayjs().add(1, "day").hour(hours).minute(minutes).second(0);
    next = { name: "Fajr", time: prayerTime };
  }

  return next;
};
