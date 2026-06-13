"use client";

import dynamic from "next/dynamic";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import PlanEntryManager from "@/components/PlanEntryManager";
import { itinerary, type DayPlan } from "@/data/itinerary";
import { placesWithUrl, type PlaceWithUrl } from "@/data/places";
import { getEntries } from "@/app/actions/entries";
import { isSupabaseConfigured, browserClient } from "@/lib/supabase";

const TripMap = dynamic(() => import("@/components/TripMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-sand text-sm text-ink-soft">
      Ładowanie mapy…
    </div>
  ),
});

type Group = {
  key: string;
  label: string;
  mapCities: PlaceWithUrl["city"][];
  days: DayPlan[];
};

const GROUPS: Group[] = [
  {
    key: "Rzym",
    label: "Rzym",
    mapCities: ["Rzym"],
    days: itinerary.filter((d) => d.city === "Rzym"),
  },
  {
    key: "Piza",
    label: "Piza",
    mapCities: ["Piza"],
    days: itinerary.filter((d) => d.city === "Rzym → Piza" || d.city.includes("Piza")),
  },
  {
    key: "Lucca",
    label: "Lucca",
    mapCities: ["Lucca"],
    days: itinerary.filter((d) => d.city.includes("Lucca")),
  },
  {
    key: "Powroty",
    label: "Powroty",
    mapCities: [],
    days: itinerary.filter((d) => d.city === "Wyloty"),
  },
];

function shortDate(iso: string) {
  return `${iso.slice(8, 10)}.${iso.slice(5, 7)}`;
}

function NumberBadge({ num }: { num: number }) {
  return (
    <span
      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-cream"
      style={{ backgroundColor: "#bf5a34" }}
    >
      {num}
    </span>
  );
}

function hasCoords(d: Record<string, unknown>): boolean {
  const lat = Number(d.lat);
  const lng = Number(d.lng);
  return Number.isFinite(lat) && lat !== 0 && Number.isFinite(lng) && lng !== 0;
}

function PlanPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialTab = useMemo(() => {
    const city = searchParams.get("city");
    const idx = GROUPS.findIndex((g) => g.key === city);
    return idx >= 0 ? idx : 0;
  }, [searchParams]);

  const [activeTab, setActiveTab] = useState(initialTab);
  const [dayEntries, setDayEntries] = useState<Map<string, Record<string, unknown>[]>>(new Map());
  const [flyToCoords, setFlyToCoords] = useState<[number, number] | null>(null);
  const [mapOpen, setMapOpen] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);

  const activeGroup = GROUPS[activeTab];

  const selectTab = useCallback(
    (i: number) => {
      setActiveTab(i);
      router.replace(`/plan?city=${GROUPS[i].key}`, { scroll: false });
    },
    [router],
  );

  const fetchDayEntries = useCallback(async () => {
    const next = new Map<string, Record<string, unknown>[]>();
    await Promise.all(
      activeGroup.days.map(async (day) => {
        try {
          const rows = await getEntries(`plan:${day.date}`);
          next.set(
            day.date,
            rows.map((r) => r.data),
          );
        } catch {
          /* ignore */
        }
      }),
    );
    setDayEntries(next);
  }, [activeGroup]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    fetchDayEntries();
  }, [fetchDayEntries]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const sb = browserClient();
    const channels = activeGroup.days.map((day) =>
      sb
        .channel(`plan-page:${day.date}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "entries",
            filter: `scope=eq.plan:${day.date}`,
          },
          () => fetchDayEntries(),
        )
        .subscribe(),
    );
    return () => {
      channels.forEach((ch) => sb.removeChannel(ch));
    };
  }, [activeGroup, fetchDayEntries]);

  useEffect(() => {
    if (!flyToCoords) return;
    mapRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    const t = setTimeout(() => setFlyToCoords(null), 1500);
    return () => clearTimeout(t);
  }, [flyToCoords]);

  const activeCityForMap = activeGroup.mapCities[0] ?? activeGroup.label;

  // Numbered pins: text(lowercase) -> number, only for entries that have coords.
  const numberedPins = useMemo(() => {
    const result = new Map<string, number>();
    let num = 1;
    for (const day of activeGroup.days) {
      const entries = dayEntries.get(day.date) ?? [];
      for (const entry of entries) {
        if (hasCoords(entry)) {
          const key = String(entry.text ?? "").toLowerCase();
          if (!result.has(key)) result.set(key, num++);
        }
      }
    }
    return result;
  }, [dayEntries, activeGroup]);

  // Pins built from plan entries that carry coordinates.
  const planMapPins = useMemo<PlaceWithUrl[]>(() => {
    const pins: PlaceWithUrl[] = [];
    const seen = new Set<string>();
    for (const day of activeGroup.days) {
      const entries = dayEntries.get(day.date) ?? [];
      for (const entry of entries) {
        if (!hasCoords(entry)) continue;
        const name = String(entry.text ?? "");
        const key = name.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        pins.push({
          name,
          city: activeCityForMap as PlaceWithUrl["city"],
          type: (entry.place_type as PlaceWithUrl["type"]) ?? "atrakcja",
          lat: Number(entry.lat),
          lng: Number(entry.lng),
          note: String(entry.time || ""),
          url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${name} ${activeCityForMap}`,
          )}`,
        });
      }
    }
    return pins;
  }, [dayEntries, activeGroup, activeCityForMap]);

  const placesBackgroundPins = useMemo(
    () =>
      placesWithUrl.filter((p) =>
        activeGroup.mapCities.includes(p.city as PlaceWithUrl["city"]),
      ),
    [activeGroup],
  );

  const mapPins = useMemo(() => {
    const planNames = new Set(planMapPins.map((p) => p.name.toLowerCase()));
    const filteredBg = placesBackgroundPins.filter((p) => !planNames.has(p.name.toLowerCase()));
    return [...filteredBg, ...planMapPins];
  }, [placesBackgroundPins, planMapPins]);

  // For the map's numbered prop we key by pin name; plan pins use entry text.
  const numberedByName = useMemo(() => {
    const result = new Map<string, number>();
    for (const [text, num] of numberedPins) {
      const pin = planMapPins.find((p) => p.name.toLowerCase() === text);
      if (pin) result.set(pin.name, num);
    }
    return result;
  }, [numberedPins, planMapPins]);

  const legendChips = useMemo(() => {
    const chips: { num: number; name: string; lat: number; lng: number }[] = [];
    for (const [text, num] of numberedPins) {
      const pin = planMapPins.find((p) => p.name.toLowerCase() === text);
      if (pin) chips.push({ num, name: pin.name, lat: pin.lat, lng: pin.lng });
    }
    return chips.sort((a, b) => a.num - b.num);
  }, [numberedPins, planMapPins]);

  const showMap = activeGroup.mapCities.length > 0;

  return (
    <div>
      <PageHeader
        emoji="🗺️"
        title="Plan zwiedzania"
        desc="Propozycja dzień po dniu - Rzym, Piza, Lucca. Punkty możecie dodawać, edytować i usuwać."
      />

      {/* City tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {GROUPS.map((g, i) => (
          <button
            key={g.key}
            type="button"
            onClick={() => selectTab(i)}
            className={
              "border-2 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors " +
              (i === activeTab
                ? "border-terracotta bg-terracotta text-cream"
                : "border-ink/25 bg-cream text-ink-soft hover:text-ink")
            }
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Day timeline */}
      <div className="w-full">
        <ol className="relative space-y-8 border-l-2 border-sand-dark pl-6">
          {activeGroup.days.map((day) => (
            <li key={day.date} className="relative">
              <span className="absolute -left-8.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-sand-dark bg-cream text-sm">
                {day.emoji}
              </span>
              <div className="rounded-2xl border border-sand-dark bg-white/70 p-6 shadow-sm">
                <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-display text-xl font-semibold text-ink">{day.title}</h2>
                  <span className="text-sm font-medium text-terracotta">
                    {day.weekday} · {shortDate(day.date)} · {day.city}
                  </span>
                </div>
                <PlanEntryManager
                  scope={`plan:${day.date}`}
                  onDataChange={fetchDayEntries}
                  numberedPins={numberedPins}
                  onPinClick={(lat, lng) => setFlyToCoords([lat, lng])}
                />
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Map (only for city groups that have a map) */}
      {showMap && (
        <div ref={mapRef} className="mt-8">
          <button
            type="button"
            onClick={() => setMapOpen((v) => !v)}
            className="mb-3 flex w-full items-center justify-between border-b-2 border-sand-dark pb-2 text-left"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
              Mapa — {activeGroup.label}
            </span>
            <span className="text-xs text-ink-soft">{mapOpen ? "▲ zwiń" : "▼ rozwiń"}</span>
          </button>
          {mapOpen && (
            <>
              {legendChips.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {legendChips.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setFlyToCoords([c.lat, c.lng])}
                      className="flex items-center gap-1.5 rounded-full border border-sand-dark bg-cream px-2.5 py-0.5 text-xs text-ink transition-colors hover:border-terracotta hover:bg-terracotta/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                    >
                      <NumberBadge num={c.num} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              )}
              <div className="map-vintage h-96 w-full overflow-hidden rounded-sm border-2 border-ink/30">
                <TripMap key={activeGroup.key} pins={mapPins} numbered={numberedByName} flyTo={flyToCoords} />
              </div>
              <div className="mt-2 text-xs text-ink-soft/70">
                Numerowane piny = punkty z planu · Najedź lub kliknij
              </div>
              <details className="mt-3 text-xs text-ink-soft">
                <summary className="cursor-pointer hover:text-ink">Jak dodać pinezkę do planu?</summary>
                <div className="mt-2 space-y-2 pl-2">
                  <p>
                    Pinezka pojawi się na mapie, gdy podasz jej <strong>współrzędne</strong>:{" "}
                    <strong>lat</strong> (szerokość) i <strong>lng</strong> (długość) - dwie liczby, np.{" "}
                    <code className="rounded bg-sand px-1">41.8902</code> i{" "}
                    <code className="rounded bg-sand px-1">12.4922</code>.
                  </p>
                  <p>Jak je zdobyć z Map Google:</p>
                  <ol className="ml-4 list-decimal space-y-1">
                    <li>Znajdź miejsce w Mapach Google.</li>
                    <li>
                      Kliknij na nim <strong>prawym przyciskiem</strong> (na telefonie: przytrzymaj
                      palec na punkcie).
                    </li>
                    <li>
                      U góry menu pojawią się dwie liczby (np.{" "}
                      <code className="rounded bg-sand px-1">41.8902, 12.4922</code>) - kliknij, żeby
                      skopiować.
                    </li>
                    <li>
                      Pierwsza liczba → pole <strong>lat</strong>, druga → pole <strong>lng</strong>.
                    </li>
                  </ol>
                  <p>
                    W edycji punktu rozwiń sekcję <strong>📍 Lokalizacja</strong> i wklej obie liczby.
                    Po zapisaniu pinezka od razu pojawi się na mapie (i u innych na żywo).
                  </p>
                </div>
              </details>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function PlanPage() {
  return (
    <Suspense fallback={null}>
      <PlanPageInner />
    </Suspense>
  );
}
