// Group budget and settlements.
// 1) Add shared expenses in `expenses` (who paid, how much, what for).
// 2) When someone pays back their share, record it in `settlements`.

import { travelers } from "./travelers";

export const groupSize = travelers.length;

export type Expense = {
  date: string; // ISO
  title: string;
  category: "nocleg" | "transport" | "atrakcje" | "jedzenie" | "inne";
  amount: number; // EUR
  paidBy: string; // traveler id from travelers.ts, e.g. "dawid"
  // Whose expense this is. Empty/absent = entire group.
  sharedBy?: string[];
};

// Settlement: cash repayment outside the shared expense pool.
export type Settlement = {
  from: string; // payer id
  to: string; // recipient id
  amount: number; // EUR
  note?: string;
};

export const expenses: Expense[] = [
  {
    date: "2026-07-15",
    title: "Bilety do Pizy (Krzywa Wieża + katedra)",
    category: "atrakcje",
    amount: 75,
    paidBy: "dawid",
  },
];

export const settlements: Settlement[] = [
  {
    from: "wiktoria",
    to: "dawid",
    amount: 18.75,
    note: "oddała swoją część za bilety do Pizy",
  },
];

export const categoryLabels: Record<Expense["category"], { label: string; emoji: string }> = {
  nocleg: { label: "Nocleg", emoji: "🏨" },
  transport: { label: "Transport", emoji: "🚆" },
  atrakcje: { label: "Atrakcje", emoji: "🎟️" },
  jedzenie: { label: "Jedzenie", emoji: "🍝" },
  inne: { label: "Inne", emoji: "🧾" },
};
