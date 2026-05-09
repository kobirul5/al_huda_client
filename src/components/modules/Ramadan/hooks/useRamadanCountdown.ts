import { useState, useEffect } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

export const useRamadanCountdown = (startDate: string) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const targetDate = dayjs(startDate);

  useEffect(() => {
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
  }, [targetDate]);

  return timeLeft;
};
