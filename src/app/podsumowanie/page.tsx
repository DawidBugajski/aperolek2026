import PageHeader from "@/components/PageHeader";
import PrintButton from "@/components/PrintButton";
import {
  expenses as staticExpenses,
  settlements as staticSettlements,
  categoryLabels,
} from "@/data/budget";
import { travelers } from "@/data/travelers";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getBudget } from "@/app/actions/budget";
import { computeBalances, suggestTransfers } from "@/lib/settle";

export const metadata = { title: "Podsumowanie" };
export const dynamic = "force-dynamic";

type Cat = keyof typeof categoryLabels;
type Exp = { amount: number; paidBy: string; category: Cat; sharedBy?: string[] };
type Sett = { from: string; to: string; amount: number };

const nameById = Object.fromEntries(travelers.map((t) => [t.id, t.name]));
const emojiById = Object.fromEntries(travelers.map((t) => [t.id, t.emoji]));
const categoryOrder = Object.keys(categoryLabels) as Cat[];

function eur(n: number) {
  return n.toLocaleString("pl-PL", { style: "currency", currency: "EUR" });
}

async function loadData(): Promise<{ expenses: Exp[]; settlements: Sett[] }> {
  if (isSupabaseConfigured) {
    try {
      const { expenses, settlements } = await getBudget();
      return {
        expenses: expenses.map((e) => ({
          amount: Number(e.amount),
          paidBy: e.paid_by,
          category: e.category as Cat,
          sharedBy: e.shared_by ?? undefined,
        })),
        settlements: settlements.map((s) => ({
          from: s.from_person,
          to: s.to_person,
          amount: Number(s.amount),
        })),
      };
    } catch {
      /* fall through to static data */
    }
  }
  return {
    expenses: staticExpenses.map((e) => ({
      amount: e.amount,
      paidBy: e.paidBy,
      category: e.category as Cat,
      sharedBy: e.sharedBy,
    })),
    settlements: staticSettlements.map((s) => ({ from: s.from, to: s.to, amount: s.amount })),
  };
}

export default async function PodsumowaniePage() {
  const { expenses, settlements } = await loadData();
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const byCategory = categoryOrder
    .map((cat) => ({
      cat,
      total: expenses.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0),
    }))
    .filter((c) => c.total > 0.01)
    .sort((a, b) => b.total - a.total);

  const balances = computeBalances(
    travelers.map((t) => t.id),
    expenses,
    settlements,
  );
  const paidBy = balances
    .filter((b) => b.paid > 0.01)
    .sort((a, b) => b.paid - a.paid);
  const suggested = suggestTransfers(balances);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageHeader
          emoji="📊"
          title="Podsumowanie wyjazdu"
          desc="Zestawienie kosztów i finalne rozliczenie - gotowe do druku lub zapisania jako PDF."
        />
        <PrintButton />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-sand-dark bg-white/70 p-5 shadow-sm">
          <p className="text-sm text-ink-soft">Razem wydane</p>
          <p className="font-display text-3xl font-bold text-terracotta">{eur(total)}</p>
        </div>
        <div className="rounded-2xl border border-sand-dark bg-white/70 p-5 shadow-sm">
          <p className="text-sm text-ink-soft">Średnio na osobę ({travelers.length})</p>
          <p className="font-display text-3xl font-bold text-ink">
            {eur(total / travelers.length)}
          </p>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 font-display text-xl font-semibold text-ink">Wg kategorii</h2>
        {byCategory.length === 0 ? (
          <p className="rounded-xl border border-dashed border-sand-dark bg-cream px-4 py-3 text-sm text-ink-soft">
            Brak wydatków.
          </p>
        ) : (
          <div className="space-y-2">
            {byCategory.map(({ cat, total: catTotal }) => (
              <div
                key={cat}
                className="flex items-center justify-between gap-3 rounded-xl border border-sand-dark bg-white/70 px-4 py-3 text-sm"
              >
                <span className="font-medium text-ink">
                  <span className="mr-1" aria-hidden>{categoryLabels[cat].emoji}</span>
                  {categoryLabels[cat].label}
                </span>
                <span className="flex items-center gap-3">
                  <span className="tabular-nums text-ink-soft">
                    {Math.round((catTotal / total) * 100)}%
                  </span>
                  <span className="font-semibold tabular-nums text-ink">{eur(catTotal)}</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-3 font-display text-xl font-semibold text-ink">Kto ile zapłacił</h2>
        {paidBy.length === 0 ? (
          <p className="rounded-xl border border-dashed border-sand-dark bg-cream px-4 py-3 text-sm text-ink-soft">
            Nikt jeszcze nic nie zapłacił.
          </p>
        ) : (
          <div className="space-y-2">
            {paidBy.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-sand-dark bg-white/70 px-4 py-3 text-sm"
              >
                <span className="font-medium text-ink">
                  <span className="mr-1" aria-hidden>{emojiById[b.id]}</span>
                  {nameById[b.id]}
                </span>
                <span className="font-semibold tabular-nums text-ink">{eur(b.paid)}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-3 font-display text-xl font-semibold text-ink">Finalne rozliczenie</h2>
        {suggested.length === 0 ? (
          <p className="rounded-xl border border-olive/40 bg-olive/5 px-4 py-3 text-sm text-ink">
            ✓ Wszyscy rozliczeni - nikt nikomu nic nie jest winien.
          </p>
        ) : (
          <div className="space-y-2">
            {suggested.map((s, i) => (
              <div
                key={i}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-sand-dark bg-white/70 px-4 py-3 text-sm"
              >
                <span className="text-ink">
                  <span aria-hidden>{emojiById[s.from]}</span>{" "}
                  <strong>{nameById[s.from]}</strong> → oddaje →{" "}
                  <span aria-hidden>{emojiById[s.to]}</span>{" "}
                  <strong>{nameById[s.to]}</strong>
                </span>
                <span className="font-semibold tabular-nums text-terracotta">{eur(s.amount)}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
