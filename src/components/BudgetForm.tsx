"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { travelers } from "@/data/travelers";
import { categoryLabels } from "@/data/budget";
import { trip } from "@/data/trip";
import { useIdentity } from "@/components/IdentityProvider";
import { useReadOnly } from "@/components/ReadOnlyProvider";
import { addExpense, addSettlement } from "@/app/actions/budget";

const categories = Object.keys(categoryLabels) as (keyof typeof categoryLabels)[];

const inputClass =
  "w-full border border-ink/25 bg-cream px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none";

export default function BudgetForm() {
  const { identity } = useIdentity();
  const readOnly = useReadOnly();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState<"wydatek" | "zwrot">("wydatek");
  const [error, setError] = useState<string | null>(null);

  const [date, setDate] = useState<string>(trip.startDate);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("jedzenie");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(identity?.id ?? travelers[0].id);
  const [sharedBy, setSharedBy] = useState<string[]>([]);

  const [from, setFrom] = useState(identity?.id ?? travelers[0].id);
  const [to, setTo] = useState(travelers[1].id);
  const [sAmount, setSAmount] = useState("");
  const [note, setNote] = useState("");

  const toggleShared = (id: string) =>
    setSharedBy((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const submitExpense = () => {
    setError(null);
    const value = Number(amount.replace(",", "."));
    if (!title.trim() || !Number.isFinite(value) || value <= 0) {
      setError("Podaj tytuł i poprawną kwotę.");
      return;
    }
    startTransition(async () => {
      try {
        await addExpense({ date, title: title.trim(), category, amount: value, paidBy, sharedBy });
        setTitle("");
        setAmount("");
        setSharedBy([]);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Błąd zapisu.");
      }
    });
  };

  const submitSettlement = () => {
    setError(null);
    const value = Number(sAmount.replace(",", "."));
    if (from === to || !Number.isFinite(value) || value <= 0) {
      setError("Wybierz dwie różne osoby i poprawną kwotę.");
      return;
    }
    startTransition(async () => {
      try {
        await addSettlement({ from, to, amount: value, note: note.trim() });
        setSAmount("");
        setNote("");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Błąd zapisu.");
      }
    });
  };

  return (
    <div className="postcard p-5">
      <div className="mb-4 flex gap-2">
        {(["wydatek", "zwrot"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={
              "border-2 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors " +
              (tab === t
                ? "border-terracotta bg-terracotta text-cream"
                : "border-ink/25 bg-cream text-ink-soft hover:text-ink")
            }
          >
            {t === "wydatek" ? "+ Wydatek" : "+ Zwrot"}
          </button>
        ))}
      </div>

      {tab === "wydatek" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block text-ink-soft">Data</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-ink-soft">Kwota (EUR)</span>
            <input
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="np. 84"
              className={inputClass}
            />
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="mb-1 block text-ink-soft">Za co</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="np. Kolacja w Trastevere"
              className={inputClass}
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-ink-soft">Kategoria</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {categoryLabels[c].emoji} {categoryLabels[c].label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-ink-soft">Kto zapłacił</span>
            <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)} className={inputClass}>
              {travelers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
          <div className="text-sm sm:col-span-2">
            <span className="mb-1 block text-ink-soft">
              Kogo dotyczy <span className="text-ink-soft/70">(nic = cała ekipa)</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
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
          </div>
          <div className="sm:col-span-2">
            <button
              type="button"
              onClick={submitExpense}
              disabled={pending || readOnly}
              className="border-2 border-ink/40 bg-terracotta px-5 py-2 text-sm font-semibold uppercase tracking-wide text-cream disabled:opacity-50"
            >
              {pending ? "Zapisywanie…" : "Dodaj wydatek"}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block text-ink-soft">Kto oddaje</span>
            <select value={from} onChange={(e) => setFrom(e.target.value)} className={inputClass}>
              {travelers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-ink-soft">Komu</span>
            <select value={to} onChange={(e) => setTo(e.target.value)} className={inputClass}>
              {travelers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-ink-soft">Kwota (EUR)</span>
            <input
              inputMode="decimal"
              value={sAmount}
              onChange={(e) => setSAmount(e.target.value)}
              placeholder="np. 18.75"
              className={inputClass}
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-ink-soft">Notka (opcjonalnie)</span>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="np. za bilety do Pizy"
              className={inputClass}
            />
          </label>
          <div className="sm:col-span-2">
            <button
              type="button"
              onClick={submitSettlement}
              disabled={pending || readOnly}
              className="border-2 border-ink/40 bg-olive px-5 py-2 text-sm font-semibold uppercase tracking-wide text-cream disabled:opacity-50"
            >
              {pending ? "Zapisywanie…" : "Dodaj zwrot"}
            </button>
          </div>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-wine">{error}</p>}
    </div>
  );
}
