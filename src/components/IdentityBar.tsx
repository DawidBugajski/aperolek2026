"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { travelers } from "@/data/travelers";
import { useIdentity } from "@/components/IdentityProvider";
import { useReadOnly } from "@/components/ReadOnlyProvider";

export default function IdentityBar() {
  const { identity, ready, setIdentity, clear } = useIdentity();
  const [picking, setPicking] = useState(false);
  const pathname = usePathname();
  const readOnly = useReadOnly();

  if (pathname === "/login") return null;

  if (readOnly) {
    return (
      <div className="no-print border-b border-sand-dark/60 bg-sand/40">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-2 px-4 py-2 text-sm">
          <span className="text-ink-soft">Jesteś:</span>
          <span className="font-semibold text-ink">👤 Gość</span>
          <span className="rounded-full bg-wine/10 px-2 py-0.5 text-xs font-medium text-wine">
            tryb podglądu - edycja wyłączona
          </span>
        </div>
      </div>
    );
  }

  // Avoid flash before localStorage is read on client.
  if (!ready) return <div className="h-9" aria-hidden />;

  const choose = (id: string) => {
    setIdentity(id);
    setPicking(false);
  };

  const showPicker = !identity || picking;

  return (
    <div className="border-b border-sand-dark/60 bg-sand/40">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2 text-sm">
        {showPicker ? (
          <>
            <span className="font-medium text-ink">
              {identity ? "Zmień, kim jesteś:" : "👋 Kim jesteś?"}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {travelers.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => choose(t.id)}
                  className={
                    "border px-2.5 py-1 text-sm font-medium transition-colors " +
                    (identity?.id === t.id
                      ? "border-terracotta bg-terracotta/10 text-terracotta"
                      : "border-ink/20 bg-cream text-ink hover:border-terracotta")
                  }
                >
                  <span className="mr-1" aria-hidden>{t.emoji}</span>
                  {t.name}
                </button>
              ))}
            </div>
            {!identity && (
              <span className="text-ink-soft">
                — dzięki temu masz własną listę pakowania i podpisujesz zmiany.
              </span>
            )}
            {identity && (
              <button
                type="button"
                onClick={() => setPicking(false)}
                className="text-ink-soft underline hover:text-ink"
              >
                anuluj
              </button>
            )}
          </>
        ) : (
          <>
            <span className="text-ink-soft">Jesteś:</span>
            <span className="font-semibold text-ink">
              <span className="mr-1" aria-hidden>{identity!.emoji}</span>
              {identity!.name}
            </span>
            <button
              type="button"
              onClick={() => setPicking(true)}
              className="text-ink-soft underline hover:text-terracotta"
            >
              zmień
            </button>
            <button
              type="button"
              onClick={clear}
              className="ml-auto text-ink-soft/70 underline hover:text-wine"
            >
              wyloguj
            </button>
          </>
        )}
      </div>
    </div>
  );
}
