import { describe, it, expect } from "vitest";
import {
  computeBalances,
  suggestTransfers,
  remainingDebt,
  type PersonBalance,
} from "./settle";

const IDS = ["dawid", "karolina", "wiktoria", "banan"];

function balanceOf(balances: PersonBalance[], id: string) {
  return balances.find((b) => b.id === id)!.balance;
}

describe("computeBalances", () => {
  it("splits a whole-group expense evenly", () => {
    const balances = computeBalances(
      IDS,
      [{ amount: 75, paidBy: "dawid" }],
      [],
    );
    expect(balanceOf(balances, "dawid")).toBeCloseTo(56.25); // 75 - 18.75
    expect(balanceOf(balances, "karolina")).toBeCloseTo(-18.75);
    expect(balanceOf(balances, "wiktoria")).toBeCloseTo(-18.75);
    expect(balanceOf(balances, "banan")).toBeCloseTo(-18.75);
  });

  it("splits only among sharedBy when set", () => {
    const balances = computeBalances(
      IDS,
      [{ amount: 100, paidBy: "dawid", sharedBy: ["dawid", "karolina"] }],
      [],
    );
    expect(balanceOf(balances, "dawid")).toBeCloseTo(50); // paid 100, owes 50
    expect(balanceOf(balances, "karolina")).toBeCloseTo(-50);
    expect(balanceOf(balances, "wiktoria")).toBeCloseTo(0);
    expect(balanceOf(balances, "banan")).toBeCloseTo(0);
  });

  it("balances always sum to zero", () => {
    const balances = computeBalances(
      IDS,
      [
        { amount: 75, paidBy: "dawid" },
        { amount: 40, paidBy: "wiktoria", sharedBy: ["wiktoria", "banan"] },
      ],
      [{ from: "karolina", to: "dawid", amount: 10 }],
    );
    const sum = balances.reduce((s, b) => s + b.balance, 0);
    expect(sum).toBeCloseTo(0);
  });
});

describe("suggestTransfers — the overpayment case (Wiktoria sends 20, not 18.75)", () => {
  const balances = computeBalances(
    IDS,
    [{ amount: 75, paidBy: "dawid" }],
    [{ from: "wiktoria", to: "dawid", amount: 20 }],
  );

  it("makes Wiktoria a small creditor (she overpaid 1.25)", () => {
    expect(balanceOf(balances, "dawid")).toBeCloseTo(36.25);
    expect(balanceOf(balances, "wiktoria")).toBeCloseTo(1.25);
    expect(balanceOf(balances, "karolina")).toBeCloseTo(-18.75);
    expect(balanceOf(balances, "banan")).toBeCloseTo(-18.75);
  });

  it("routes Banan's leftover to cover Wiktoria's overpayment", () => {
    const t = suggestTransfers(balances);
    expect(t).toEqual([
      { from: "karolina", to: "dawid", amount: 18.75 },
      { from: "banan", to: "dawid", amount: expect.closeTo(17.5) },
      { from: "banan", to: "wiktoria", amount: expect.closeTo(1.25) },
    ]);
  });
});

describe("suggestTransfers — exact repayment is clean", () => {
  it("no Banan→Wiktoria transfer when Wiktoria pays exactly her share", () => {
    const balances = computeBalances(
      IDS,
      [{ amount: 75, paidBy: "dawid" }],
      [{ from: "wiktoria", to: "dawid", amount: 18.75 }],
    );
    expect(balanceOf(balances, "wiktoria")).toBeCloseTo(0);
    const t = suggestTransfers(balances);
    expect(t).toEqual([
      { from: "karolina", to: "dawid", amount: 18.75 },
      { from: "banan", to: "dawid", amount: 18.75 },
    ]);
  });
});

describe("suggestTransfers — orphaned settlement (old APR-001 confusion)", () => {
  it("a settlement with no matching expense reverses the debt (correct math)", () => {
    const balances = computeBalances(
      IDS,
      [], // expense was deleted
      [{ from: "wiktoria", to: "dawid", amount: 18.75 }],
    );
    expect(balanceOf(balances, "wiktoria")).toBeCloseTo(18.75); // group now owes her
    expect(balanceOf(balances, "dawid")).toBeCloseTo(-18.75);
    expect(suggestTransfers(balances)).toEqual([
      { from: "dawid", to: "wiktoria", amount: 18.75 },
    ]);
  });
});

describe("suggestTransfers — nothing to settle", () => {
  it("returns no transfers when everyone is square", () => {
    const balances = computeBalances(IDS, [], []);
    expect(suggestTransfers(balances)).toEqual([]);
  });
});

describe("remainingDebt", () => {
  it("returns the debt when balance is negative", () => {
    expect(remainingDebt(-18.75)).toBeCloseTo(18.75);
  });
  it("returns 0 when settled or overpaid", () => {
    expect(remainingDebt(0)).toBe(0);
    expect(remainingDebt(1.25)).toBe(0);
  });
});
