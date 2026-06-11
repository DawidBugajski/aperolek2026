"use client";

import PageHeader from "@/components/PageHeader";
import EntryManager, { type Field } from "@/components/EntryManager";
import { itinerary } from "@/data/itinerary";

function shortDate(iso: string) {
  return `${iso.slice(8, 10)}.${iso.slice(5, 7)}`;
}

const fields: Field[] = [
  { key: "time", label: "Godzina (opcjonalnie)", placeholder: "12:00" },
  { key: "text", label: "Co", required: true },
];

export default function PlanPage() {
  return (
    <div>
      <PageHeader
        emoji="🗺️"
        title="Plan zwiedzania"
        desc="Propozycja dzień po dniu - Rzym, Piza, Lucca. Punkty każdego dnia możecie dodawać, edytować i usuwać."
      />

      <ol className="relative space-y-6 border-l-2 border-sand-dark pl-6">
        {itinerary.map((day) => (
          <li key={day.date} className="relative">
            <span className="absolute -left-[34px] flex h-7 w-7 items-center justify-center rounded-full border-2 border-sand-dark bg-cream text-sm">
              {day.emoji}
            </span>
            <div className="rounded-2xl border border-sand-dark bg-white/70 p-5 shadow-sm">
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-display text-xl font-semibold text-ink">{day.title}</h2>
                <span className="text-sm font-medium text-terracotta">
                  {day.weekday} · {shortDate(day.date)} · {day.city}
                </span>
              </div>
              <EntryManager
                scope={`plan:${day.date}`}
                addLabel="+ Dodaj punkt"
                emptyText="Brak punktów - dodaj pierwszy."
                fields={fields}
                renderItem={(d) => (
                  <div className="flex gap-3 text-ink">
                    {d.time ? (
                      <span className="w-16 shrink-0 font-medium text-ink">{String(d.time)}</span>
                    ) : (
                      <span className="w-16 shrink-0 text-sand-dark">•</span>
                    )}
                    <span>{String(d.text ?? "")}</span>
                  </div>
                )}
              />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
