"use client";

import { useEffect, useState } from "react";

type Remaining = { days: number; hours: number; minutes: number; seconds: number };

function diff(target: number): Remaining | null {
  const ms = target - Date.now();
  if (ms <= 0) return null;
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  const seconds = Math.floor((ms % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

export default function Countdown({ targetIso }: { targetIso: string }) {
  // Target: midnight Italian time on departure day.
  const target = new Date(`${targetIso}T00:00:00+02:00`).getTime();
  const [rem, setRem] = useState<Remaining | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Mount flag avoids SSR hydration mismatch for time-dependent UI.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setRem(diff(target));
    const id = setInterval(() => setRem(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!mounted) {
    return <div className="h-[92px]" aria-hidden />;
  }

  if (!rem) {
    return (
      <p className="font-display text-2xl font-bold text-terracotta">
        Buon viaggio! Wyjazd już trwa (albo za nami) 🇮🇹
      </p>
    );
  }

  const units: { label: string; value: number }[] = [
    { label: "giorni", value: rem.days },
    { label: "ore", value: rem.hours },
    { label: "min", value: rem.minutes },
    { label: "sec", value: rem.seconds },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
      {units.map((u) => (
        <div
          key={u.label}
          className="min-w-[74px] border-2 border-ink/30 bg-cream px-4 py-2 text-center"
          style={{ boxShadow: "3px 3px 0 rgba(58,44,29,0.15)" }}
        >
          <div className="font-display text-3xl font-bold tabular-nums text-terracotta sm:text-4xl">
            {String(u.value).padStart(2, "0")}
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-soft">
            {u.label}
          </div>
        </div>
      ))}
    </div>
  );
}
