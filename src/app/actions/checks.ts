"use server";

import { adminClient } from "@/lib/supabaseAdmin";
import { assertCanWrite } from "@/lib/session";

export async function getChecks(
  scope: string,
  person: string,
): Promise<Record<string, boolean>> {
  const sb = adminClient();
  const { data, error } = await sb
    .from("checks")
    .select("item, checked")
    .eq("scope", scope)
    .eq("person", person);
  if (error) throw new Error(error.message);
  const map: Record<string, boolean> = {};
  for (const row of data ?? []) {
    map[row.item as string] = row.checked as boolean;
  }
  return map;
}

export async function setCheck(
  scope: string,
  person: string,
  item: string,
  checked: boolean,
  checkedBy: string,
): Promise<void> {
  await assertCanWrite();
  const sb = adminClient();
  const { error } = await sb.from("checks").upsert(
    {
      scope,
      person,
      item,
      checked,
      checked_by: checkedBy,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "scope,person,item" },
  );
  if (error) throw new Error(error.message);
}
