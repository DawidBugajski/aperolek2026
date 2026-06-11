"use client";

import PageHeader from "@/components/PageHeader";
import TripMapClient from "@/components/TripMapClient";
import EntryManager from "@/components/EntryManager";

const typeLabel: Record<string, { label: string; emoji: string }> = {
  nocleg: { label: "Nocleg", emoji: "🏨" },
  atrakcja: { label: "Atrakcja", emoji: "📸" },
  jedzenie: { label: "Jedzenie", emoji: "🍝" },
};

function mapsUrl(name: string, city: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${city}`)}`;
}

export default function MapaPage() {
  return (
    <div>
      <PageHeader
        emoji="📍"
        title="Mapa"
        desc="Prawdziwa mapa z naszymi punktami. Najedź lub kliknij pinezkę. Punkty możecie dodawać, edytować i usuwać niżej - mapa zaktualizuje się sama."
      />

      <TripMapClient />

      <p className="mt-4 mb-8 text-xs text-ink-soft">
        Mapa (OpenStreetMap) z naszymi pinezkami. Każda pinezka i każdy punkt prowadzi do Map Google.
      </p>

      <h2 className="mb-3 font-display text-xl font-semibold text-ink">Punkty</h2>

      <details className="mb-4 rounded-xl border border-sand-dark bg-white/70 p-4">
        <summary className="cursor-pointer text-sm font-semibold text-ink">
          📍 Jak dodać pinezkę? (skąd wziąć współrzędne)
        </summary>
        <div className="mt-2 space-y-2 text-sm text-ink-soft">
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
              Kliknij na nim <strong>prawym przyciskiem</strong> (na telefonie: przytrzymaj palec na
              punkcie).
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
          <p>Po zapisaniu pinezka od razu pojawi się na mapie (i u innych na żywo).</p>
        </div>
      </details>

      <EntryManager
        scope="places"
        addLabel="+ Dodaj punkt"
        emptyText="Brak punktów - dodaj pierwszy (potrzebne współrzędne lat/lng)."
        fields={[
          { key: "name", label: "Nazwa", required: true, placeholder: "Koloseum" },
          {
            key: "city",
            label: "Miasto",
            type: "select",
            options: [
              { value: "Rzym", label: "Rzym" },
              { value: "Piza", label: "Piza" },
              { value: "Lucca", label: "Lucca" },
            ],
          },
          {
            key: "type",
            label: "Typ",
            type: "select",
            options: [
              { value: "atrakcja", label: "Atrakcja" },
              { value: "nocleg", label: "Nocleg" },
              { value: "jedzenie", label: "Jedzenie" },
            ],
          },
          { key: "lat", label: "Szerokość (lat)", type: "number", placeholder: "41.8902" },
          { key: "lng", label: "Długość (lng)", type: "number", placeholder: "12.4922" },
          { key: "note", label: "Notka (opcjonalnie)" },
        ]}
        renderItem={(d) => (
          <a
            href={mapsUrl(String(d.name ?? ""), String(d.city ?? ""))}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3"
          >
            <span aria-hidden>{typeLabel[String(d.type ?? "atrakcja")]?.emoji ?? "📍"}</span>
            <span className="flex-1">
              <span className="font-medium text-ink">{String(d.name ?? "")}</span>
              <span className="block text-xs text-ink-soft">
                {String(d.city ?? "")}
                {d.note ? ` · ${String(d.note)}` : ""}
              </span>
            </span>
            <span className="text-azzurro" aria-hidden>↗</span>
          </a>
        )}
      />
    </div>
  );
}
