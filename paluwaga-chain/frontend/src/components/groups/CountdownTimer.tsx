import { useEffect, useMemo, useState } from "react";

interface CountdownTimerProps {
  targetDate: string;
}

const toParts = (ms: number) => {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  return { days, hours, minutes };
};

const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const parts = useMemo(() => {
    const target = new Date(targetDate).getTime();
    return toParts(target - now);
  }, [now, targetDate]);

  return (
    <div className="rounded-2xl border border-[#c4b5fd] bg-[linear-gradient(145deg,#2a133f_0%,#3b1161_55%,#5b21b6_100%)] p-4 text-center text-white shadow-[0_14px_38px_rgba(59,17,97,0.35)]">
      <p className="text-xs uppercase tracking-[0.18em] text-[#e9d5ff]">Next Release In</p>
      <p className="mt-2 font-mono text-2xl font-bold text-[#f5d066]">
        {String(parts.days).padStart(2, "0")} : {String(parts.hours).padStart(2, "0")} : {String(parts.minutes).padStart(2, "0")}
      </p>
    </div>
  );
};

export default CountdownTimer;
