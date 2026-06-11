// Czyści tabele expenses + settlements i wstawia pierwszy realny wydatek (pociąg)
// oraz zwrot Wiktorii. Uruchom:
//   node --env-file=.env.local scripts/seed-budget.mjs
import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { persistSession: false } },
);

const DUMMY = "00000000-0000-0000-0000-000000000000";

// Czyszczenie
await sb.from("expenses").delete().neq("id", DUMMY);
await sb.from("settlements").delete().neq("id", DUMMY);

// Wydatek: bilety na pociąg Rzym -> Piza, 75 EUR, zapłacił Dawid, cała ekipa
const exp = await sb.from("expenses").insert({
  date: "2026-07-29",
  title: "Bilety na pociąg Rzym → Piza",
  category: "transport",
  amount: 75,
  paid_by: "dawid",
  shared_by: null,
});
console.log("wydatek (pociąg):", exp.error ? `BŁĄD -> ${exp.error.message}` : "OK");

// Zwrot: Wiktoria oddała Dawidowi swoją część (75 / 4 = 18,75)
const set = await sb.from("settlements").insert({
  from_person: "wiktoria",
  to_person: "dawid",
  amount: 18.75,
  note: "oddała za bilety na pociąg",
});
console.log("zwrot (Wiktoria):", set.error ? `BŁĄD -> ${set.error.message}` : "OK");
