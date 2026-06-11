"use server";

import { adminClient } from "@/lib/supabaseAdmin";
import { assertCanWrite } from "@/lib/session";
import { revalidatePath } from "next/cache";

export type DbExpense = {
  id: string;
  date: string;
  title: string;
  category: string;
  amount: number | string;
  paid_by: string;
  shared_by: string[] | null;
};

export type DbSettlement = {
  id: string;
  from_person: string;
  to_person: string;
  amount: number | string;
  note: string | null;
};

export async function getBudget(): Promise<{
  expenses: DbExpense[];
  settlements: DbSettlement[];
}> {
  const sb = adminClient();
  const [exp, set] = await Promise.all([
    sb.from("expenses").select("*").order("date", { ascending: true }),
    sb.from("settlements").select("*").order("created_at", { ascending: true }),
  ]);
  if (exp.error) throw new Error(exp.error.message);
  if (set.error) throw new Error(set.error.message);
  return {
    expenses: (exp.data ?? []) as DbExpense[],
    settlements: (set.data ?? []) as DbSettlement[],
  };
}

export async function addExpense(input: {
  date: string;
  title: string;
  category: string;
  amount: number;
  paidBy: string;
  sharedBy: string[];
}): Promise<void> {
  await assertCanWrite();
  const sb = adminClient();
  const { error } = await sb.from("expenses").insert({
    date: input.date,
    title: input.title,
    category: input.category,
    amount: input.amount,
    paid_by: input.paidBy,
    shared_by: input.sharedBy.length ? input.sharedBy : null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/budzet");
}

export async function addSettlement(input: {
  from: string;
  to: string;
  amount: number;
  note: string;
}): Promise<void> {
  await assertCanWrite();
  const sb = adminClient();
  const { error } = await sb.from("settlements").insert({
    from_person: input.from,
    to_person: input.to,
    amount: input.amount,
    note: input.note || null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/budzet");
}

export async function updateExpense(
  id: string,
  input: {
    date: string;
    title: string;
    category: string;
    amount: number;
    paidBy: string;
    sharedBy: string[];
  },
): Promise<void> {
  await assertCanWrite();
  const sb = adminClient();
  const { error } = await sb
    .from("expenses")
    .update({
      date: input.date,
      title: input.title,
      category: input.category,
      amount: input.amount,
      paid_by: input.paidBy,
      shared_by: input.sharedBy.length ? input.sharedBy : null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/budzet");
}

export async function updateSettlement(
  id: string,
  input: { from: string; to: string; amount: number; note: string },
): Promise<void> {
  await assertCanWrite();
  const sb = adminClient();
  const { error } = await sb
    .from("settlements")
    .update({
      from_person: input.from,
      to_person: input.to,
      amount: input.amount,
      note: input.note || null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/budzet");
}

export async function deleteExpense(id: string): Promise<void> {
  await assertCanWrite();
  const sb = adminClient();
  const { error } = await sb.from("expenses").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/budzet");
}

export async function deleteSettlement(id: string): Promise<void> {
  await assertCanWrite();
  const sb = adminClient();
  const { error } = await sb.from("settlements").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/budzet");
}
