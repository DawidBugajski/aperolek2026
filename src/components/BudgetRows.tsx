"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { travelers } from "@/data/travelers";
import { categoryLabels } from "@/data/budget";
import { useReadOnly } from "@/components/ReadOnlyProvider";
import { useToast } from "@/components/ToastProvider";
import {
  updateExpense,
  deleteExpense,
  updateSettlement,
  deleteSettlement,
} from "@/app/actions/budget";

const nameById = Object.fromEntries(travelers.map((t) => [t.id, t.name]));
const emojiById = Object.fromEntries(travelers.map((t) => [t.id, t.emoji]));
const categories = Object.keys(categoryLabels) as (keyof typeof categoryLabels)[];
const inputClass =
  "w-full border border-ink/25 bg-cream px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none";

function eur(n: number) {
  return n.toLocaleString("pl-PL", { style: "currency", currency: "EUR" });
}

export type ExpenseData = {
  id: string;
  date: string;
  title: string;
  category: string;
  amount: number;
  paidBy: string;
  sharedBy?: string[];
};

export function ExpenseRow({ expense }: { expense: ExpenseData }) {
  const router = useRouter();
  const readOnly = useReadOnly();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const [date, setDate] = useState(expense.date);
  const [title, setTitle] = useState(expense.title);
  const [category, setCategory] = useState(expense.category);
  const [amount, setAmount] = useState(String(expense.amount));
  const [paidBy, setPaidBy] = useState(expense.paidBy);
  const [sharedBy, setSharedBy] = useState<string[]>(expense.sharedBy ?? []);

  const toggleShared = (id: string) =>
    setSharedBy((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const save = () =>
    startTransition(async () => {
      try {
        await updateExpense(expense.id, {
          date,
          title: title.trim(),
          category,
          amount: Number(amount.replace(",", ".")),
          paidBy,
          sharedBy,
        });
        setEditing(false);
        router.refresh();
        toast("Zapisano wydatek.", "success");
      } catch (e) {
        toast(e instanceof Error ? e.message : "Błąd zapisu.", "error");
      }
    });

  const remove = () => {
    if (!confirm("Usunąć wydatek?")) return;
    startTransition(async () => {
      try {
        await deleteExpense(expense.id);
        router.refresh();
        toast("Usunięto wydatek.", "success");
      } catch (e) {
        toast(e instanceof Error ? e.message : "Błąd usuwania.", "error");
      }
    });
  };

  if (editing) {
    return (
      <div className="postcard grid gap-2 p-4 sm:grid-cols-2">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
        <input value={amount} inputMode="decimal" onChange={(e) => setAmount(e.target.value)} className={inputClass} />
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass + " sm:col-span-2"} />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
          {categories.map((c) => (
            <option key={c} value={c}>
              {categoryLabels[c].emoji} {categoryLabels[c].label}
            </option>
          ))}
        </select>
        <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)} className={inputClass}>
          {travelers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <div className="flex flex-wrap gap-1.5 sm:col-span-2">
          {travelers.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => toggleShared(t.id)}
              className={
                "border px-2.5 py-1 text-sm transition-colors " +
                (sharedBy.includes(t.id)
                  ? "border-terracotta bg-terracotta/10 text-terracotta"
                  : "border-ink/20 bg-cream text-ink hover:border-terracotta")
              }
            >
              {t.emoji} {t.name}
            </button>
          ))}
        </div>
        <div className="flex gap-2 sm:col-span-2">
          <button type="button" onClick={save} disabled={pending} className="border-2 border-ink/40 bg-terracotta px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-cream disabled:opacity-50">
            Zapisz
          </button>
          <button type="button" onClick={() => setEditing(false)} className="border-2 border-ink/25 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink-soft hover:text-ink">
            Anuluj
          </button>
        </div>
      </div>
    );
  }

  const cat = categoryLabels[expense.category as keyof typeof categoryLabels];
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-sand-dark bg-white/70 px-4 py-3 text-sm">
      <span className="font-medium text-ink">
        {cat?.emoji} {expense.title}
      </span>
      <span className="flex items-center gap-3 text-ink-soft">
        <span>
          {eur(expense.amount)} · zapłacił(a){" "}
          <strong className="text-ink">{nameById[expense.paidBy] ?? expense.paidBy}</strong>
        </span>
        <button
          type="button"
          onClick={() => setEditing(true)}
          disabled={readOnly || pending}
          className="text-xs text-ink-soft hover:text-terracotta disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-ink-soft"
        >
          edytuj
        </button>
        <button
          type="button"
          onClick={remove}
          disabled={readOnly || pending}
          className="text-xs text-ink-soft/70 hover:text-wine disabled:cursor-not-allowed disabled:opacity-40"
        >
          {pending ? "usuwanie…" : "usuń"}
        </button>
      </span>
    </div>
  );
}

export type SettlementData = {
  id: string;
  from: string;
  to: string;
  amount: number;
  note?: string;
};

export function SettlementRow({ settlement }: { settlement: SettlementData }) {
  const router = useRouter();
  const readOnly = useReadOnly();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const [from, setFrom] = useState(settlement.from);
  const [to, setTo] = useState(settlement.to);
  const [amount, setAmount] = useState(String(settlement.amount));
  const [note, setNote] = useState(settlement.note ?? "");

  const save = () =>
    startTransition(async () => {
      try {
        await updateSettlement(settlement.id, {
          from,
          to,
          amount: Number(amount.replace(",", ".")),
          note: note.trim(),
        });
        setEditing(false);
        router.refresh();
        toast("Zapisano zwrot.", "success");
      } catch (e) {
        toast(e instanceof Error ? e.message : "Błąd zapisu.", "error");
      }
    });

  const remove = () => {
    if (!confirm("Usunąć zwrot?")) return;
    startTransition(async () => {
      try {
        await deleteSettlement(settlement.id);
        router.refresh();
        toast("Usunięto zwrot.", "success");
      } catch (e) {
        toast(e instanceof Error ? e.message : "Błąd usuwania.", "error");
      }
    });
  };

  if (editing) {
    return (
      <div className="postcard grid gap-2 p-4 sm:grid-cols-2">
        <select value={from} onChange={(e) => setFrom(e.target.value)} className={inputClass}>
          {travelers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <select value={to} onChange={(e) => setTo(e.target.value)} className={inputClass}>
          {travelers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <input value={amount} inputMode="decimal" onChange={(e) => setAmount(e.target.value)} className={inputClass} />
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Notka" className={inputClass} />
        <div className="flex gap-2 sm:col-span-2">
          <button type="button" onClick={save} disabled={pending} className="border-2 border-ink/40 bg-olive px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-cream disabled:opacity-50">
            Zapisz
          </button>
          <button type="button" onClick={() => setEditing(false)} className="border-2 border-ink/25 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink-soft hover:text-ink">
            Anuluj
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-olive/40 bg-olive/5 px-4 py-3 text-sm">
      <span className="text-ink">
        ✓ <strong>{nameById[settlement.from] ?? settlement.from}</strong> oddał(a){" "}
        <strong>{nameById[settlement.to] ?? settlement.to}</strong>
        {settlement.note && <span className="text-ink-soft"> - {settlement.note}</span>}
      </span>
      <span className="flex items-center gap-3">
        <span className="font-semibold tabular-nums text-olive">{eur(settlement.amount)}</span>
        <button
          type="button"
          onClick={() => setEditing(true)}
          disabled={readOnly || pending}
          className="text-xs text-ink-soft hover:text-terracotta disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-ink-soft"
        >
          edytuj
        </button>
        <button
          type="button"
          onClick={remove}
          disabled={readOnly || pending}
          className="text-xs text-ink-soft/70 hover:text-wine disabled:cursor-not-allowed disabled:opacity-40"
        >
          {pending ? "usuwanie…" : "usuń"}
        </button>
      </span>
    </div>
  );
}
