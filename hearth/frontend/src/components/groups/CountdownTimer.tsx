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
    <div className="rounded-2xl border border-amber/40 bg-[linear-gradient(145deg,#3A2418_0%,#5B3D2D_55%,#7A4F38_100%)] p-4 text-center text-cream shadow-[0_14px_38px_rgba(58,36,24,0.32)]">
      <p className="text-xs uppercase tracking-[0.18em] text-amber-soft">Next warmth in</p>
      <p className="mt-2 font-mono text-2xl font-bold text-amber">
        {String(parts.days).padStart(2, "0")} : {String(parts.hours).padStart(2, "0")} : {String(parts.minutes).padStart(2, "0")}
      </p>
    </div>
  );
};

export default CountdownTimer;
