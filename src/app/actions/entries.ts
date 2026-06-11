"use server";

import { adminClient } from "@/lib/supabaseAdmin";
import { assertCanWrite } from "@/lib/session";

export type Entry = {
  id: string;
  scope: string;
  sort: number;
  data: Record<string, unknown>;
};

export async function getEntries(scope: string): Promise<Entry[]> {
  const sb = adminClient();
  const { data, error } = await sb
    .from("entries")
    .select("*")
    .eq("scope", scope)
    .order("sort", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Entry[];
}

export async function addEntry(
  scope: string,
  data: Record<string, unknown>,
  by?: string | null,
): Promise<Entry> {
  await assertCanWrite();
  const sb = adminClient();
  // _by / _at = kto i kiedy ostatnio dodał/zmienił (do podpisu w UI).
  const payload = { ...data, _by: by ?? null, _at: new Date().toISOString() };
  const { data: row, error } = await sb
    .from("entries")
    .insert({ scope, data: payload, sort: Date.now() })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return row as Entry;
}

export async function updateEntry(
  id: string,
  data: Record<string, unknown>,
  by?: string | null,
): Promise<void> {
  await assertCanWrite();
  const sb = adminClient();
  const payload = { ...data, _by: by ?? null, _at: new Date().toISOString() };
  const { error } = await sb.from("entries").update({ data: payload }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteEntry(id: string): Promise<void> {
  await assertCanWrite();
  const sb = adminClient();
  const { error } = await sb.from("entries").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
