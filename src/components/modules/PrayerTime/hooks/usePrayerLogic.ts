import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { findNextPrayer, PrayerTimes } from "../utils/prayerUtils";

export const usePrayerLogic = (prayerData: { timings: PrayerTimes } | null) => {
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: dayjs.Dayjs } | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (prayerData) {
      setNextPrayer(findNextPrayer(prayerData.timings));
    }
  }, [prayerData, currentTime]);

  useEffect(() => {
    if (nextPrayer) {
      const diff = nextPrayer.time.diff(currentTime);
      const dur = dayjs.duration(diff);
      const hours = Math.floor(dur.asHours());
      const mins = dur.minutes();
      const secs = dur.seconds();
      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${mins
          .toString()
          .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
      );
    }
  }, [nextPrayer, currentTime]);

  return { currentTime, nextPrayer, timeLeft };
};
