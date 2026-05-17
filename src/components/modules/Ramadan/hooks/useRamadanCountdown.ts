import { useState, useEffect } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

const ramadanStartDates = [
  "2026-02-18",
  "2027-02-08",
  "2028-01-28",
  "2029-01-16",
  "2030-01-05",
  "2030-12-26",
];

export const getNextRamadanStartDate = () => {
  const today = dayjs().startOf("day");
  return ramadanStartDates.find((date) => dayjs(date).isAfter(today)) || ramadanStartDates[ramadanStartDates.length - 1];
};

export const useRamadanCountdown = (startDate: string) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = dayjs(startDate);

    const calculateTimeLeft = () => {
      const now = dayjs();
      const diff = targetDate.diff(now);
      
      if (diff > 0) {
        const dur = dayjs.duration(diff);
        setTimeLeft({
          days: Math.floor(dur.asDays()),
          hours: dur.hours(),
          minutes: dur.minutes(),
          seconds: dur.seconds()
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [startDate]);

  return timeLeft;
};
