// Budżet / rozliczenia grupowe.
// 1) Dodawaj wspólne wydatki w `expenses` (kto zapłacił, ile, czego dotyczy).
// 2) Gdy ktoś odda swoją część - dopisz to w `settlements`.
// Strona policzy salda, podział na osobę i podpowie, kto komu jeszcze odda.

import { travelers } from "./travelers";

export const groupSize = travelers.length;

export type Expense = {
  date: string; // ISO
  title: string;
  category: "nocleg" | "transport" | "atrakcje" | "jedzenie" | "inne";
  amount: number; // w EUR
  paidBy: string; // id z travelers.ts, np. "dawid"
  // Kogo dotyczy wydatek. Pusta/brak = cała ekipa.
  sharedBy?: string[];
};

// Zwrot: kto komu oddał gotówkę (rozliczenie poza wspólnymi wydatkami).
export type Settlement = {
  from: string; // id - kto oddaje
  to: string; // id - komu
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
    // brak sharedBy = dzielimy na całą ekipę (4 osoby -> 18,75 € / os.)
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
