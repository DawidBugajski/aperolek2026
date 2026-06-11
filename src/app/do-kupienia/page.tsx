"use client";

import PageHeader from "@/components/PageHeader";
import EditableChecklist from "@/components/EditableChecklist";
import { shopping } from "@/data/shopping";

export default function DoKupieniaPage() {
  return (
    <div>
      <PageHeader
        emoji="🛒"
        title="Do kupienia przed wyjazdem"
        desc="Wspólna lista dla całej ekipy. Pozycje możecie dodawać, edytować i usuwać."
      />

      <div className="grid gap-6 sm:grid-cols-2">
        {shopping.map((group) => (
          <section key={group.title}>
            <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-ink">
              <span aria-hidden>{group.emoji}</span>
              {group.title}
            </h2>
            <EditableChecklist scope={`shopping:${group.title}`} perPerson={false} />
          </section>
        ))}
      </div>
    </div>
  );
}
