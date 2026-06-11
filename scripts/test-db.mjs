// Quick Supabase connection test (secret key). Run with:
//   node --env-file=.env.local scripts/test-db.mjs
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in env.");
  process.exit(1);
}

const sb = createClient(url, key, { auth: { persistSession: false } });

for (const t of ["checks", "expenses", "settlements"]) {
  const { error, count } = await sb.from(t).select("*", { count: "exact", head: true });
  console.log(`table ${t}:`, error ? `ERROR -> ${error.message}` : `OK (${count} rows)`);
}

const probe = { scope: "_test", person: "_probe", item: "ping", checked: true, checked_by: "test" };
const up = await sb.from("checks").upsert(probe, { onConflict: "scope,person,item" });
console.log("test write:", up.error ? `ERROR -> ${up.error.message}` : "OK");

const del = await sb.from("checks").delete().eq("scope", "_test");
console.log("cleanup:", del.error ? `ERROR -> ${del.error.message}` : "OK");
