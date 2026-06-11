"use client";

import PageHeader from "@/components/PageHeader";
import EntryManager from "@/components/EntryManager";

export default function BiletyPage() {
  return (
    <div>
      <PageHeader
        emoji="🎟️"
        title="Bilety czasowe"
        desc="Wejścia na konkretną godzinę - kupowane z wyprzedzeniem. To najważniejsza lista wyjazdu: Koloseum i Watykan potrafią się wyprzedać na kilka dni do przodu."
      />

      <div className="mb-6 rounded-2xl border border-terracotta/40 bg-terracotta/5 p-4 text-sm text-ink">
        ⚠️ <strong>Zarezerwujmy te bilety jak najwcześniej.</strong> Przy każdym ustalmy,
        kto rezerwuje, i zmieńmy status na „zarezerwowane”.
      </div>

      <EntryManager
        scope="bilety"
        addLabel="+ Dodaj bilet"
        fields={[
          { key: "name", label: "Nazwa", required: true, placeholder: "Koloseum + Forum" },
          { key: "city", label: "Miasto", placeholder: "Rzym" },
          { key: "why", label: "Dlaczego ważne", type: "textarea" },
          { key: "officialUrl", label: "Link do biletów (URL)" },
          { key: "assignedTo", label: "Kto rezerwuje" },
          { key: "bookedFor", label: "Termin (np. 28.07, 10:30)" },
          {
            key: "status",
            label: "Status",
            type: "select",
            options: [
              { value: "do-rezerwacji", label: "Do rezerwacji" },
              { value: "zarezerwowane", label: "Zarezerwowane" },
            ],
          },
        ]}
        renderItem={(d) => {
          const booked = d.status === "zarezerwowane";
          return (
            <div>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-semibold text-ink">{String(d.name ?? "")}</h2>
                  {d.city ? <p className="text-sm font-medium text-terracotta">{String(d.city)}</p> : null}
                </div>
                <span
                  className={
                    "rounded-full px-3 py-1 text-xs font-semibold " +
                    (booked ? "bg-olive/15 text-olive" : "bg-wine/10 text-wine")
                  }
                >
                  {booked ? "✓ Zarezerwowane" : "○ Do rezerwacji"}
                </span>
              </div>
              {d.why ? <p className="mt-2 text-sm text-ink-soft">{String(d.why)}</p> : null}
              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <span className="text-ink-soft">
                  Kto rezerwuje:{" "}
                  <strong className="text-ink">{d.assignedTo ? String(d.assignedTo) : "— do ustalenia"}</strong>
                </span>
                {d.bookedFor ? (
                  <span className="text-ink-soft">
                    Termin: <strong className="text-ink">{String(d.bookedFor)}</strong>
                  </span>
                ) : null}
                {d.officialUrl ? (
                  <a
                    href={String(d.officialUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-azzurro hover:underline"
                  >
                    Oficjalna strona biletów ↗
                  </a>
                ) : null}
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
