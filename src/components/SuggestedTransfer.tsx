"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { travelers } from "@/data/travelers";
import { useReadOnly } from "@/components/ReadOnlyProvider";
import { useToast } from "@/components/ToastProvider";
import { addSettlement } from "@/app/actions/budget";

const nameById = Object.fromEntries(travelers.map((t) => [t.id, t.name]));
const emojiById = Object.fromEntries(travelers.map((t) => [t.id, t.emoji]));

function eur(n: number) {
  return n.toLocaleString("pl-PL", { style: "currency", currency: "EUR" });
}
const round2 = (n: number) => Math.round(n * 100) / 100;

// One "Do oddania" suggestion with a one-click "rozlicz" button that records
// it as a real settlement. Once saved, balances recompute and the suggestion
// disappears. The button only shows when the DB is live and editing allowed.
export default function SuggestedTransfer({
  from,
  to,
  amount,
  live,
}: {
  from: string;
  to: string;
  amount: number;
  live: boolean;
}) {
  const router = useRouter();
  const readOnly = useReadOnly();
  const toast = useToast();
  const [pending, startTransition] = useTransition();

  const settle = () => {
    const value = round2(amount);
    if (!confirm(`Zapisać zwrot: ${nameById[from]} → ${nameById[to]} (${eur(value)})?`)) return;
    startTransition(async () => {
      try {
        await addSettlement({ from, to, amount: value, note: "" });
        router.refresh();
        toast("Zapisano zwrot.", "success");
      } catch (e) {
        toast(e instanceof Error ? e.message : "Błąd zapisu.", "error");
      }
    });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-sand-dark bg-white/70 px-4 py-3 text-sm">
      <span className="text-ink">
        <span aria-hidden>{emojiById[from]}</span>{" "}
        <strong>{nameById[from]}</strong> → oddaje →{" "}
        <span aria-hidden>{emojiById[to]}</span>{" "}
        <strong>{nameById[to]}</strong>
      </span>
      <span className="flex items-center gap-3">
        <span className="font-semibold tabular-nums text-terracotta">{eur(amount)}</span>
        {live && (
          <button
            type="button"
            onClick={settle}
            disabled={readOnly || pending}
            className="border-2 border-ink/40 bg-olive px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cream disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? "zapisywanie…" : "rozlicz"}
          </button>
        )}
      </span>
    </div>
  );
}
