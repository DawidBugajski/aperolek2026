"use client";

import PageHeader from "@/components/PageHeader";
import EntryManager from "@/components/EntryManager";
import { travelers } from "@/data/travelers";

function shortDate(iso: string) {
  return `${iso.slice(8, 10)}.${iso.slice(5, 7)}`;
}

export default function TransportPage() {
  const flightRows = travelers.flatMap((t) =>
    t.flights.map((f) => ({ traveler: t.name, emoji: t.emoji, ...f })),
  );

  return (
    <div>
      <PageHeader
        emoji="🚆"
        title="Transport"
        desc="Loty ekipy, transfery z lotnisk, pociągi między miastami i ważne ostrzeżenie o ZTL."
      />

      {/* Loty */}
      <section className="mb-8">
        <h2 className="mb-3 font-display text-xl font-semibold text-ink">✈️ Loty ekipy</h2>
        <div className="overflow-x-auto rounded-2xl border border-sand-dark bg-white/70 shadow-sm">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-sand-dark text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-medium">Osoba</th>
                <th className="px-4 py-3 font-medium">Kierunek</th>
                <th className="px-4 py-3 font-medium">Data</th>
                <th className="px-4 py-3 font-medium">Trasa</th>
                <th className="px-4 py-3 font-medium">Wylot</th>
                <th className="px-4 py-3 font-medium">Ląd.</th>
              </tr>
            </thead>
            <tbody>
              {flightRows.map((f, i) => (
                <tr key={i} className="border-b border-sand-dark/40 last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">
                    <span className="mr-1" aria-hidden>{f.emoji}</span>
                    {f.traveler}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        "rounded-full px-2 py-0.5 text-xs font-medium " +
                        (f.direction === "tam"
                          ? "bg-azzurro/15 text-azzurro"
                          : "bg-wine/10 text-wine")
                      }
                    >
                      {f.direction}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{shortDate(f.date)}</td>
                  <td className="px-4 py-3 text-ink">
                    {f.from} → {f.to}
                    {f.note && <span className="block text-xs text-ink-soft">{f.note}</span>}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-ink">{f.depart ?? "-"}</td>
                  <td className="px-4 py-3 tabular-nums text-ink-soft">{f.arrive ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Wskazówki - edytowalne */}
      <section>
        <h2 className="mb-3 font-display text-xl font-semibold text-ink">Wskazówki</h2>
        <EntryManager
          scope="transport"
          addLabel="+ Dodaj wskazówkę"
          fields={[
            { key: "emoji", label: "Emoji", placeholder: "🚝" },
            { key: "title", label: "Tytuł", required: true },
            { key: "body", label: "Treść", type: "textarea", required: true },
            { key: "linkLabel", label: "Etykieta linku (opcjonalnie)" },
            { key: "linkUrl", label: "URL linku (opcjonalnie)" },
          ]}
          renderItem={(d) => (
            <div>
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
                <span aria-hidden>{String(d.emoji ?? "")}</span>
                {String(d.title ?? "")}
              </h3>
              <p className="mt-1 text-sm text-ink-soft">{String(d.body ?? "")}</p>
              {d.linkUrl ? (
                <a
                  href={String(d.linkUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-sm font-medium text-azzurro hover:underline"
                >
                  {String(d.linkLabel || "Link")} ↗
                </a>
              ) : null}
            </div>
          )}
        />
      </section>
    </div>
  );
}
