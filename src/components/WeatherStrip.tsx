"use client";

import { useEffect, useState } from "react";
import type { CityWeather } from "@/lib/weather";

// Drop city photos here to replace gradients:
//   public/cities/roma.jpg
//   public/cities/pisa.jpg
//   public/cities/lucca.jpg
const CITY_CONFIG: Record<string, { photo: string; gradient: string }> = {
  Roma:  { photo: "/cities/roma.jpg",  gradient: "linear-gradient(160deg,#3B0A00 0%,#7C2D12 60%,#9A3412 100%)" },
  Pisa:  { photo: "/cities/pisa.jpg",  gradient: "linear-gradient(160deg,#1C1200 0%,#78350F 60%,#92400E 100%)" },
  Lucca: { photo: "/cities/lucca.jpg", gradient: "linear-gradient(160deg,#052E16 0%,#14532D 60%,#166534 100%)" },
};

const REFRESH_MS = 10 * 60 * 1000;

export default function WeatherStrip() {
  const [cities, setCities] = useState<CityWeather[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/weather");
        if (!res.ok || cancelled) return;
        const data: CityWeather[] | null = await res.json();
        if (cancelled) return;
        setCities(data);
        setUpdatedAt(new Date());
      } catch {
        // fail silently
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    const id = setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  if (!loading && !cities) return null;

  return (
    <section>
      <div className="mb-5 flex items-center gap-4">
        <h2 className="font-display text-2xl font-bold text-ink">Pogoda</h2>
        <div className="rule-fancy flex-1" />
        <span className="kicker text-[10px]">
          {loading && !updatedAt
            ? "ładowanie…"
            : updatedAt
            ? `teraz · ${updatedAt.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}`
            : null}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {loading && !cities
          ? [0, 1, 2].map((i) => <div key={i} className="h-44 animate-pulse bg-ink/10" />)
          : cities!.map((city) => <CityCard key={city.city} city={city} />)}
      </div>
    </section>
  );
}

function CityCard({ city }: { city: CityWeather }) {
  const cfg = CITY_CONFIG[city.city] ?? {
    photo: "",
    gradient: "linear-gradient(160deg,#1C1917 0%,#44403C 100%)",
  };

  return (
    <div
      className="relative h-44 overflow-hidden rounded-2xl"
      style={{ background: cfg.gradient }}
    >
      {/* photo layer — renders on top of gradient if file exists */}
      {cfg.photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cfg.photo}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700"
          onLoad={(e) => ((e.target as HTMLImageElement).style.opacity = "1")}
        />
      )}

      {/* dark scrim */}
      <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/30 to-black/10 rounded-2xl" />

      {/* content */}
      <div className="absolute inset-0 flex flex-col justify-between p-4">
        {/* top row */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-1 text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.8)]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span className="text-xs font-semibold tracking-wide">{city.city}</span>
          </div>
          <span className="text-2xl leading-none drop-shadow-lg" aria-hidden>{city.emoji}</span>
        </div>

        {/* bottom: temp + condition */}
        <div>
          <div className="flex items-baseline gap-2 [text-shadow:0_2px_8px_rgba(0,0,0,0.9)]">
            <span className="font-display text-5xl font-bold text-white leading-none">
              {city.tempC}°
            </span>
            <span className="text-sm text-white/70">odcz. {city.feelsLikeC}°</span>
          </div>
          <p className="mt-1 text-sm font-medium text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.9)]">{city.desc}</p>
        </div>
      </div>
    </div>
  );
}
