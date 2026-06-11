import PageHeader from "@/components/PageHeader";
import BudgetForm from "@/components/BudgetForm";
import { ExpenseRow, SettlementRow } from "@/components/BudgetRows";
import {
  expenses as staticExpenses,
  settlements as staticSettlements,
  categoryLabels,
} from "@/data/budget";
import { travelers } from "@/data/travelers";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getBudget } from "@/app/actions/budget";

export const metadata = { title: "Budżet" };
export const dynamic = "force-dynamic";

type Cat = keyof typeof categoryLabels;
type Exp = {
  id?: string;
  date: string;
  title: string;
  category: Cat;
  amount: number;
  paidBy: string;
  sharedBy?: string[];
};
type Sett = { id?: string; from: string; to: string; amount: number; note?: string };

const nameById = Object.fromEntries(travelers.map((t) => [t.id, t.name]));
const emojiById = Object.fromEntries(travelers.map((t) => [t.id, t.emoji]));

function eur(n: number) {
  return n.toLocaleString("pl-PL", { style: "currency", currency: "EUR" });
}

async function loadData(): Promise<{ expenses: Exp[]; settlements: Sett[]; live: boolean }> {
  if (isSupabaseConfigured) {
    try {
      const { expenses, settlements } = await getBudget();
      return {
        live: true,
        expenses: expenses.map((e) => ({
          id: e.id,
          date: e.date,
          title: e.title,
          category: e.category as Cat,
          amount: Number(e.amount),
          paidBy: e.paid_by,
          sharedBy: e.shared_by ?? undefined,
        })),
        settlements: settlements.map((s) => ({
          id: s.id,
          from: s.from_person,
          to: s.to_person,
          amount: Number(s.amount),
          note: s.note ?? undefined,
        })),
      };
    } catch {
      /* fall through to static data */
    }
  }
  return {
    live: false,
    expenses: staticExpenses.map((e) => ({ ...e, category: e.category as Cat })),
    settlements: staticSettlements.map((s) => ({
      from: s.from,
      to: s.to,
      amount: s.amount,
      note: s.note,
    })),
  };
}

export default async function BudzetPage() {
  const { expenses, settlements, live } = await loadData();
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const paid: Record<string, number> = {};
  const owed: Record<string, number> = {};
  const settledOut: Record<string, number> = {};
  const settledIn: Record<string, number> = {};
  travelers.forEach((t) => {
    paid[t.id] = 0;
    owed[t.id] = 0;
    settledOut[t.id] = 0;
    settledIn[t.id] = 0;
  });

  for (const e of expenses) {
    paid[e.paidBy] += e.amount;
    const sharers = e.sharedBy?.length ? e.sharedBy : travelers.map((t) => t.id);
    const share = e.amount / sharers.length;
    sharers.forEach((id) => {
      owed[id] += share;
    });
  }
  for (const s of settlements) {
    settledOut[s.from] += s.amount;
    settledIn[s.to] += s.amount;
  }

  const balance: Record<string, number> = {};
  travelers.forEach((t) => {
    balance[t.id] = paid[t.id] - owed[t.id] + settledOut[t.id] - settledIn[t.id];
  });

  const creditors = travelers
    .map((t) => ({ id: t.id, amt: balance[t.id] }))
    .filter((x) => x.amt > 0.01)
    .sort((a, b) => b.amt - a.amt);
  const debtors = travelers
    .map((t) => ({ id: t.id, amt: -balance[t.id] }))
    .filter((x) => x.amt > 0.01)
    .sort((a, b) => b.amt - a.amt);

  const suggested: { from: string; to: string; amount: number }[] = [];
  let ci = 0;
  let di = 0;
  while (ci < creditors.length && di < debtors.length) {
    const pay = Math.min(creditors[ci].amt, debtors[di].amt);
    suggested.push({ from: debtors[di].id, to: creditors[ci].id, amount: pay });
    creditors[ci].amt -= pay;
    debtors[di].amt -= pay;
    if (creditors[ci].amt <= 0.01) ci++;
    if (debtors[di].amt <= 0.01) di++;
  }

  return (
    <div>
      <PageHeader
        emoji="💸"
        title="Budżet / rozliczenia"
        desc="Kto za co zapłacił i jak wychodzi podział kosztów. Salda, podział na osobę i zwroty liczą się automatycznie."
      />

      {live ? (
        <div className="mb-8">
          <BudgetForm />
        </div>
      ) : (
        <p className="mb-8 rounded-xl border border-dashed border-sand-dark bg-cream px-4 py-3 text-sm text-ink-soft">
          Dane budżetu pochodzą teraz z pliku. Po podłączeniu bazy (patrz DB-SETUP.md)
          pojawi się tu formularz dodawania wydatków i zwrotów.
        </p>
      )}

      <details className="mb-8 rounded-2xl border border-sand-dark bg-white/70 p-4">
        <summary className="cursor-pointer font-display text-lg font-semibold text-ink">
          ❓ Jak działa budżet? (krótkie FAQ)
        </summary>
        <div className="mt-3 space-y-3 text-sm text-ink-soft">
          <p>
            <strong className="text-ink">1. Wydatek wrzucasz RAZ.</strong> Wybierasz, kto zapłacił,
            ile i kogo dotyczy (nic zaznaczone = cała ekipa). Podział na osoby liczy się
            automatycznie - nikt nic nie przeklikuje.
          </p>
          <p>
            <strong className="text-ink">2. „Do oddania" liczy się samo.</strong> Strona pokazuje,
            kto komu ile jest winien. Przykład: Dawid płaci 75 € za pociąg dla 4 osób → każdy ma
            udział 18,75 €, a reszta oddaje Dawidowi po 18,75 €.
          </p>
          <p>
            <strong className="text-ink">3. Zwrot dodajesz dopiero, gdy ktoś realnie odda kasę.</strong>{" "}
            Np. Wiktoria daje Dawidowi 18,75 € → wtedy klikasz „+ Zwrot". To zapis faktycznego
            oddania pieniędzy, a nie obowiązek dla każdego.
          </p>
          <p>
            <strong className="text-ink">4. Nie ma znaczenia, na kogo jesteś zalogowany.</strong>{" "}
            Liczy się to, co wybierzesz w formularzu. Imię tylko podpowiada domyślnie Ciebie jako
            płacącego (możesz zmienić na dowolną osobę).
          </p>
        </div>
      </details>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-sand-dark bg-white/70 p-5 shadow-sm">
          <p className="text-sm text-ink-soft">Suma wspólnych wydatków</p>
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
        <h2 className="mb-3 font-display text-xl font-semibold text-ink">Bilans ekipy</h2>
        <div className="overflow-x-auto rounded-2xl border border-sand-dark bg-white/70 shadow-sm">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-sand-dark text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-medium">Osoba</th>
                <th className="px-4 py-3 font-medium">Zapłacił(a)</th>
                <th className="px-4 py-3 font-medium">Udział</th>
                <th className="px-4 py-3 font-medium">Oddał(a)</th>
                <th className="px-4 py-3 font-medium">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {travelers.map((t) => {
                const b = balance[t.id];
                return (
                  <tr key={t.id} className="border-b border-sand-dark/40 last:border-0">
                    <td className="px-4 py-3 font-medium text-ink">
                      <span className="mr-1" aria-hidden>{t.emoji}</span>
                      {t.name}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-ink">{eur(paid[t.id])}</td>
                    <td className="px-4 py-3 tabular-nums text-ink-soft">{eur(owed[t.id])}</td>
                    <td className="px-4 py-3 tabular-nums text-ink-soft">
                      {settledOut[t.id] ? eur(settledOut[t.id]) : "-"}
                    </td>
                    <td
                      className={
                        "px-4 py-3 font-semibold tabular-nums " +
                        (Math.abs(b) < 0.01 ? "text-ink-soft" : b > 0 ? "text-olive" : "text-wine")
                      }
                    >
                      {Math.abs(b) < 0.01 ? "rozliczony ✓" : (b > 0 ? "+" : "") + eur(b)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-ink-soft">
          Saldo dodatnie = ekipa jest tej osobie winna. Ujemne = ta osoba jeszcze dopłaca.
        </p>
      </section>

      {suggested.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 font-display text-xl font-semibold text-ink">Do oddania</h2>
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
        </section>
      )}

      {settlements.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 font-display text-xl font-semibold text-ink">Zwroty już zrobione</h2>
          <div className="space-y-2">
            {settlements.map((s, i) =>
              live && s.id ? (
                <SettlementRow
                  key={s.id}
                  settlement={{ id: s.id, from: s.from, to: s.to, amount: s.amount, note: s.note }}
                />
              ) : (
                <div
                  key={i}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-olive/40 bg-olive/5 px-4 py-3 text-sm"
                >
                  <span className="text-ink">
                    ✓ <strong>{nameById[s.from]}</strong> oddał(a){" "}
                    <strong>{nameById[s.to]}</strong>
                    {s.note && <span className="text-ink-soft"> - {s.note}</span>}
                  </span>
                  <span className="font-semibold tabular-nums text-olive">{eur(s.amount)}</span>
                </div>
              ),
            )}
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="mb-3 font-display text-xl font-semibold text-ink">Wspólne wydatki</h2>
        {expenses.length === 0 ? (
          <p className="rounded-xl border border-dashed border-sand-dark bg-cream px-4 py-3 text-sm text-ink-soft">
            Jeszcze brak wydatków. Dodaj pierwszy powyżej.
          </p>
        ) : (
          <div className="space-y-2">
            {expenses.map((e, i) =>
              live && e.id ? (
                <ExpenseRow
                  key={e.id}
                  expense={{
                    id: e.id,
                    date: e.date,
                    title: e.title,
                    category: e.category,
                    amount: e.amount,
                    paidBy: e.paidBy,
                    sharedBy: e.sharedBy,
                  }}
                />
              ) : (
                <div
                  key={i}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-sand-dark bg-white/70 px-4 py-3 text-sm"
                >
                  <span className="font-medium text-ink">
                    {categoryLabels[e.category]?.emoji} {e.title}
                  </span>
                  <span className="text-ink-soft">
                    {eur(e.amount)} · zapłacił(a){" "}
                    <strong className="text-ink">{nameById[e.paidBy] ?? e.paidBy}</strong>
                  </span>
                </div>
              ),
            )}
          </div>
        )}
      </section>
    </div>
  );
}
