"use client";

import PageHeader from "@/components/PageHeader";
import EntryManager, { type Field } from "@/components/EntryManager";

const fields: Field[] = [
  { key: "emoji", label: "Emoji", placeholder: "np. 🍝" },
  { key: "name", label: "Nazwa", required: true, placeholder: "np. Cacio e pepe" },
  { key: "desc", label: "Opis", type: "textarea", required: true },
];

function renderItem(d: Record<string, unknown>) {
  return (
    <div className="flex gap-3">
      <span className="text-2xl" aria-hidden>{String(d.emoji ?? "")}</span>
      <div>
        <h3 className="font-medium text-ink">{String(d.name ?? "")}</h3>
        <p className="text-sm text-ink-soft">{String(d.desc ?? "")}</p>
      </div>
    </div>
  );
}

export default function JedzeniePage() {
  return (
    <div>
      <PageHeader
        emoji="🍝"
        title="Co koniecznie spróbować"
        desc="Klasyki kuchni rzymskiej i toskańskiej. Buon appetito!"
      />

      <section className="mb-8">
        <h2 className="mb-3 font-display text-xl font-semibold text-ink">Rzym</h2>
        <EntryManager scope="jedzenie:rzym" fields={fields} renderItem={renderItem} addLabel="+ Dodaj danie" />
      </section>

      <section>
        <h2 className="mb-3 font-display text-xl font-semibold text-ink">Toskania (Piza / Lucca)</h2>
        <EntryManager scope="jedzenie:toskania" fields={fields} renderItem={renderItem} addLabel="+ Dodaj danie" />
      </section>
    </div>
  );
}
