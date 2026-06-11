"use client";

import PageHeader from "@/components/PageHeader";
import EditableChecklist from "@/components/EditableChecklist";
import { packing } from "@/data/packing";

export default function PakowaniePage() {
  return (
    <div>
      <PageHeader
        emoji="🧳"
        title="Lista pakowania"
        desc="Każdy ma własną listę (wybierz u góry, kim jesteś). Pozycje możecie dodawać, edytować i usuwać."
      />

      <div className="grid gap-6 sm:grid-cols-2">
        {packing.map((group) => (
          <section key={group.title}>
            <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-ink">
              <span aria-hidden>{group.emoji}</span>
              {group.title}
            </h2>
            <EditableChecklist scope={`packing:${group.title}`} perPerson />
          </section>
        ))}
      </div>
    </div>
  );
}
