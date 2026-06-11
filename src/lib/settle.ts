// Pure money-splitting logic for the group budget.
// No React / IO here — this is the unit-testable core behind the budget page.

const EPS = 0.01;

export type SettleExpense = {
  amount: number;
  paidBy: string;
  sharedBy?: string[] | null; // empty/absent = whole group
};

export type SettleSettlement = {
  from: string;
  to: string;
  amount: number;
};

export type PersonBalance = {
  id: string;
  paid: number; // total this person paid for shared expenses
  owed: number; // this person's share of all expenses
  settledOut: number; // cash this person has already paid back
  settledIn: number; // cash this person has already received
  balance: number; // paid - owed + settledOut - settledIn; > 0 = group owes them
};

export type Transfer = { from: string; to: string; amount: number };

// Per-person ledger. Order of `personIds` is preserved in the result.
export function computeBalances(
  personIds: string[],
  expenses: SettleExpense[],
  settlements: SettleSettlement[],
): PersonBalance[] {
  const paid: Record<string, number> = {};
  const owed: Record<string, number> = {};
  const settledOut: Record<string, number> = {};
  const settledIn: Record<string, number> = {};
  for (const id of personIds) {
    paid[id] = 0;
    owed[id] = 0;
    settledOut[id] = 0;
    settledIn[id] = 0;
  }

  for (const e of expenses) {
    if (paid[e.paidBy] === undefined) continue; // unknown payer — skip defensively
    paid[e.paidBy] += e.amount;
    const sharers = e.sharedBy && e.sharedBy.length ? e.sharedBy : personIds;
    const share = e.amount / sharers.length;
    for (const id of sharers) {
      if (owed[id] !== undefined) owed[id] += share;
    }
  }

  for (const s of settlements) {
    if (settledOut[s.from] !== undefined) settledOut[s.from] += s.amount;
    if (settledIn[s.to] !== undefined) settledIn[s.to] += s.amount;
  }

  return personIds.map((id) => ({
    id,
    paid: paid[id],
    owed: owed[id],
    settledOut: settledOut[id],
    settledIn: settledIn[id],
    balance: paid[id] - owed[id] + settledOut[id] - settledIn[id],
  }));
}

// Greedy debt simplification: match biggest creditor with biggest debtor.
// Minimizes the number of transfers. Does NOT mutate `balances`.
export function suggestTransfers(balances: PersonBalance[]): Transfer[] {
  const creditors = balances
    .filter((b) => b.balance > EPS)
    .map((b) => ({ id: b.id, amt: b.balance }))
    .sort((a, b) => b.amt - a.amt);
  const debtors = balances
    .filter((b) => b.balance < -EPS)
    .map((b) => ({ id: b.id, amt: -b.balance }))
    .sort((a, b) => b.amt - a.amt);

  const transfers: Transfer[] = [];
  let ci = 0;
  let di = 0;
  while (ci < creditors.length && di < debtors.length) {
    const pay = Math.min(creditors[ci].amt, debtors[di].amt);
    transfers.push({ from: debtors[di].id, to: creditors[ci].id, amount: pay });
    creditors[ci].amt -= pay;
    debtors[di].amt -= pay;
    if (creditors[ci].amt <= EPS) ci++;
    if (debtors[di].amt <= EPS) di++;
  }
  return transfers;
}

// How much this person still has to pay back. 0 if settled or overpaid.
// Used by the settlement form to suggest the exact amount and warn on overpay.
export function remainingDebt(balance: number): number {
  return balance < -EPS ? -balance : 0;
}
