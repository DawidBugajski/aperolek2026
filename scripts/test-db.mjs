// Szybki test połączenia z Supabase (secret key). Uruchom:
//   node --env-file=.env.local scripts/test-db.mjs
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;

if (!url || !key) {
  console.error("Brak NEXT_PUBLIC_SUPABASE_URL lub SUPABASE_SECRET_KEY w env.");
  process.exit(1);
}

const sb = createClient(url, key, { auth: { persistSession: false } });

for (const t of ["checks", "expenses", "settlements"]) {
  const { error, count } = await sb.from(t).select("*", { count: "exact", head: true });
  console.log(`tabela ${t}:`, error ? `BŁĄD -> ${error.message}` : `OK (${count} wierszy)`);
}

const probe = { scope: "_test", person: "_probe", item: "ping", checked: true, checked_by: "test" };
const up = await sb.from("checks").upsert(probe, { onConflict: "scope,person,item" });
console.log("zapis testowy:", up.error ? `BŁĄD -> ${up.error.message}` : "OK");

const del = await sb.from("checks").delete().eq("scope", "_test");
console.log("sprzątanie:", del.error ? `BŁĄD -> ${del.error.message}` : "OK");
