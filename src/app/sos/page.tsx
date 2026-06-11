"use client";

import PageHeader from "@/components/PageHeader";
import EntryManager from "@/components/EntryManager";

export default function SosPage() {
  return (
    <div>
      <PageHeader
        emoji="🆘"
        title="SOS / kontakty"
        desc="Numery alarmowe i ważne dane pod ręką. Uzupełnijmy adresy noclegów i numery do siebie."
      />

      <section className="mb-8">
        <h2 className="mb-3 font-display text-xl font-semibold text-ink">Numery alarmowe</h2>
        <EntryManager
          scope="sos:numbers"
          addLabel="+ Dodaj numer"
          fields={[
            { key: "emoji", label: "Emoji", placeholder: "🆘" },
            { key: "number", label: "Numer", required: true, placeholder: "112" },
            { key: "label", label: "Opis", required: true, placeholder: "Numer alarmowy" },
          ]}
          renderItem={(d) => (
            <div className="flex items-center gap-3">
              <span className="text-xl" aria-hidden>{String(d.emoji ?? "")}</span>
              <span>
                <a href={`tel:${String(d.number ?? "")}`} className="font-display text-2xl font-bold text-terracotta">
                  {String(d.number ?? "")}
                </a>
                <span className="block text-xs text-ink-soft">{String(d.label ?? "")}</span>
              </span>
            </div>
          )}
        />
      </section>

      <section className="mb-8">
        <h2 className="mb-3 font-display text-xl font-semibold text-ink">Ważne dane</h2>
        <EntryManager
          scope="sos:contacts"
          addLabel="+ Dodaj dane"
          fields={[
            { key: "label", label: "Co to", required: true, placeholder: "Adres noclegu w Rzymie" },
            { key: "value", label: "Wartość", type: "textarea", required: true },
          ]}
          renderItem={(d) => (
            <div className="flex flex-wrap justify-between gap-2 text-sm">
              <span className="text-ink-soft">{String(d.label ?? "")}</span>
              <span className="font-medium text-ink">{String(d.value ?? "")}</span>
            </div>
          )}
        />
      </section>

      <section>
        <h2 className="mb-3 font-display text-xl font-semibold text-ink">Na wszelki wypadek</h2>
        <EntryManager
          scope="sos:tips"
          addLabel="+ Dodaj wskazówkę"
          fields={[{ key: "text", label: "Treść", type: "textarea", required: true }]}
          renderItem={(d) => (
            <span className="flex gap-3 text-sm text-ink">
              <span aria-hidden>✅</span>
              {String(d.text ?? "")}
            </span>
          )}
        />
      </section>
    </div>
  );
}
