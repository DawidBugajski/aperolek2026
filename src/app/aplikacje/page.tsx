"use client";

import PageHeader from "@/components/PageHeader";
import EntryManager from "@/components/EntryManager";

export default function AplikacjePage() {
  return (
    <div>
      <PageHeader
        emoji="📱"
        title="Przydatne aplikacje"
        desc="Zainstalujmy przed wyjazdem (najlepiej na Wi-Fi). Lista jest edytowalna."
      />

      <EntryManager
        scope="apps"
        addLabel="+ Dodaj aplikację"
        emptyText="Brak aplikacji - dodaj pierwszą."
        fields={[
          { key: "emoji", label: "Emoji", placeholder: "np. 🗺️" },
          { key: "name", label: "Nazwa", required: true, placeholder: "np. Google Maps" },
          { key: "what", label: "Do czego", type: "textarea", required: true },
        ]}
        renderItem={(d) => (
          <div className="flex gap-3">
            <span className="text-2xl" aria-hidden>{String(d.emoji ?? "")}</span>
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">{String(d.name ?? "")}</h2>
              <p className="text-sm text-ink-soft">{String(d.what ?? "")}</p>
            </div>
          </div>
        )}
      />
    </div>
  );
}
