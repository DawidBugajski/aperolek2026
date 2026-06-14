"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { isSupabaseConfigured, browserClient } from "@/lib/supabase";
import { getEntries } from "@/app/actions/entries";
import type { PlaceWithUrl } from "@/data/places";

const TripMap = dynamic(() => import("./TripMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-sand text-sm text-ink-soft">
      Ładowanie mapy…
    </div>
  ),
});

const cityOrder = ["Rzym", "Piza", "Lucca"];
const legend = [
  { color: "#8a2f33", label: "Nocleg" },
  { color: "#bf5a34", label: "Atrakcja" },
  { color: "#6f7a3a", label: "Jedzenie" },
];

function mapsUrl(name: string, city: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${city}`)}`;
}

export default function TripMapClient() {
  const [pins, setPins] = useState<PlaceWithUrl[]>([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    try {
      const rows = await getEntries("places");
      const parsed = rows
        .map((r) => {
          const d = r.data as Record<string, unknown>;
          const name = String(d.name ?? "");
          const city = String(d.city ?? "Rzym");
          return {
            name,
            city,
            type: (d.type as PlaceWithUrl["type"]) ?? "atrakcja",
            lat: Number(d.lat),
            lng: Number(d.lng),
            note: d.note ? String(d.note) : undefined,
            url: mapsUrl(name, city),
          } as PlaceWithUrl;
        })
        .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng));
      setPins(parsed);
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Async data fetch; setState happens after await, not synchronously.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const sb = browserClient();
    const ch = sb
      .channel("entries:places:map")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "entries", filter: "scope=eq.places" },
        () => refetch(),
      )
      .subscribe();
    return () => {
      sb.removeChannel(ch);
    };
  }, [refetch]);

  if (loading) return <p className="text-sm text-ink-soft">Wczytywanie mapy…</p>;

  const cities = cityOrder.filter((c) => pins.some((p) => p.city === c));
  if (cities.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-sand-dark bg-cream px-4 py-3 text-sm text-ink-soft">
        Brak punktów na mapie - dodaj je w sekcji „Punkty” poniżej.
      </p>
    );
  }

  const safeActive = Math.min(active, cities.length - 1);
  const activeCity = cities[safeActive];
  const cityPins = pins.filter((p) => p.city === activeCity);

  return (
    <div>
      <div className="mb-3 flex gap-2">
        {cities.map((c, i) => (
          <button
            key={c}
            type="button"
            onClick={() => setActive(i)}
            className={
              "border-2 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors " +
              (i === safeActive
                ? "border-terracotta bg-terracotta text-cream"
                : "border-ink/25 bg-cream text-ink-soft hover:text-ink")
            }
          >
            {c}
          </button>
        ))}
      </div>

      <div className="map-vintage h-[440px] w-full overflow-hidden rounded-sm border-2 border-ink/30">
        <TripMap key={activeCity} pins={cityPins} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-ink-soft">
        {legend.map((l) => (
          <span key={l.label} className="flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 rounded-full border border-white" style={{ backgroundColor: l.color }} />
            {l.label}
          </span>
        ))}
        <span className="text-ink-soft/70">Najedź lub kliknij pinezkę</span>
      </div>
    </div>
  );
}
