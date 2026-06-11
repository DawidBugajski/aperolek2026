"use client";

import { usePathname } from "next/navigation";
import { travelers } from "@/data/travelers";
import { useIdentity } from "@/components/IdentityProvider";
import { useReadOnly } from "@/components/ReadOnlyProvider";

// Hard gate: until someone picks who they are, the page content is not mounted
// and a blocking modal forces a choice. Guests (read-only) and the login page
// are exempt. Children mount only after an identity exists, so every form picks
// up the correct person on first render (no silent fallback to the first crew member).
export default function IdentityGate({ children }: { children: React.ReactNode }) {
  const { identity, ready, setIdentity } = useIdentity();
  const readOnly = useReadOnly();
  const pathname = usePathname();

  const gate = ready && !identity && !readOnly && pathname !== "/login";

  if (!gate) return <>{children}</>;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="identity-gate-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 px-4 backdrop-blur-sm"
    >
      <div className="postcard w-full max-w-md p-6 text-center sm:p-8">
        <p className="text-4xl" aria-hidden>
          👋
        </p>
        <h2
          id="identity-gate-title"
          className="mt-2 font-display text-2xl font-bold text-ink"
        >
          Kim jesteś?
        </h2>
        <p className="mt-2 text-sm text-ink-soft">
          Wybierz siebie, zanim zaczniesz. Dzięki temu Twoje wydatki, zwroty i zmiany
          zapiszą się na właściwą osobę, a lista pakowania będzie Twoja.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-2">
          {travelers.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setIdentity(t.id)}
              className="border-2 border-ink/25 bg-cream px-3 py-3 text-sm font-semibold text-ink transition-colors hover:border-terracotta hover:bg-terracotta/10"
            >
              <span className="mr-1.5 text-lg" aria-hidden>
                {t.emoji}
              </span>
              {t.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
