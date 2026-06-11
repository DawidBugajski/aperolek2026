// Clears expenses + settlements tables and seeds the first real expense (train)
// and Wiktoria's settlement. Run with:
//   node --env-file=.env.local scripts/seed-budget.mjs
import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { persistSession: false } },
);

const DUMMY = "00000000-0000-0000-0000-000000000000";

// Clear existing data
await sb.from("expenses").delete().neq("id", DUMMY);
await sb.from("settlements").delete().neq("id", DUMMY);

// Expense: train tickets Rome -> Pisa, 75 EUR, paid by Dawid, whole group
const exp = await sb.from("expenses").insert({
  date: "2026-07-29",
  title: "Bilety na pociąg Rzym → Piza",
  category: "transport",
  amount: 75,
  paid_by: "dawid",
  shared_by: null,
});
console.log("expense (train):", exp.error ? `ERROR -> ${exp.error.message}` : "OK");

// Settlement: Wiktoria paid her share back to Dawid (75 / 4 = 18.75)
const set = await sb.from("settlements").insert({
  from_person: "wiktoria",
  to_person: "dawid",
  amount: 18.75,
  note: "oddała za bilety na pociąg",
});
console.log("settlement (Wiktoria):", set.error ? `ERROR -> ${set.error.message}` : "OK");
