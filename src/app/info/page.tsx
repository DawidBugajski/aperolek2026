"use client";

import PageHeader from "@/components/PageHeader";
import EntryManager from "@/components/EntryManager";

export default function InfoPage() {
  return (
    <div>
      <PageHeader
        emoji="ℹ️"
        title="Praktyczne info o Włoszech"
        desc="Drobiazgi, które realnie ułatwiają życie na miejscu. Możecie dodawać i edytować."
      />

      <EntryManager
        scope="info"
        addLabel="+ Dodaj poradę"
        emptyText="Brak porad - dodaj pierwszą."
        fields={[
          { key: "emoji", label: "Emoji", placeholder: "np. 🚰" },
          { key: "title", label: "Tytuł", required: true, placeholder: "np. Woda z fontann" },
          { key: "body", label: "Treść", type: "textarea", required: true },
        ]}
        renderItem={(d) => (
          <div>
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
              <span aria-hidden>{String(d.emoji ?? "")}</span>
              {String(d.title ?? "")}
            </h2>
            <p className="mt-1 text-sm text-ink-soft">{String(d.body ?? "")}</p>
          </div>
        )}
      />
    </div>
  );
}
