// One-off: copy ALL data from the PROD Supabase project into the DEV project,
// so local dev mirrors production content (entries/checks/expenses/settlements).
//
// DEV creds come from .env.local (NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SECRET_KEY).
// PROD creds are passed explicitly so this never touches prod by accident:
//
//   PROD_SUPABASE_URL=https://xxxx.supabase.co \
//   PROD_SUPABASE_SECRET_KEY=sb_secret_xxx \
//   node --env-file=.env.local scripts/clone-prod-to-dev.mjs
//
// WRITES ONLY TO DEV. Prod is read-only here. Clears each dev table first.
import { createClient } from "@supabase/supabase-js";

const prodUrl = process.env.PROD_SUPABASE_URL;
const prodKey = process.env.PROD_SUPABASE_SECRET_KEY;
const devUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const devKey = process.env.SUPABASE_SECRET_KEY;

if (!prodUrl || !prodKey || !devUrl || !devKey) {
  console.error("Brakuje creds. Potrzebne: PROD_SUPABASE_URL, PROD_SUPABASE_SECRET_KEY oraz DEV w .env.local.");
  process.exit(1);
}
if (prodUrl === devUrl) {
  console.error("STOP: PROD_SUPABASE_URL == DEV URL — to ten sam projekt. Przerywam, żeby nie nadpisać produkcji.");
  process.exit(1);
}

const prod = createClient(prodUrl, prodKey, { auth: { persistSession: false } });
const dev = createClient(devUrl, devKey, { auth: { persistSession: false } });

// table -> a NOT NULL column used as an "always true" filter for delete-all
const TABLES = {
  entries: "id",
  checks: "scope",
  expenses: "id",
  settlements: "id",
};

console.log(`PROD: ${prodUrl}\nDEV:  ${devUrl}\n`);

for (const [table, keyCol] of Object.entries(TABLES)) {
  const read = await prod.from(table).select("*");
  if (read.error) {
    console.error(`✗ PROD read ${table}: ${read.error.message} — przerywam, DEV nietknięty.`);
    process.exit(1);
  }
  const rows = read.data ?? [];

  const del = await dev.from(table).delete().not(keyCol, "is", null);
  if (del.error) {
    console.error(`✗ DEV clear ${table}: ${del.error.message}`);
    process.exit(1);
  }

  if (rows.length) {
    // insert in chunks to stay well under any payload limits
    const SIZE = 200;
    for (let i = 0; i < rows.length; i += SIZE) {
      const ins = await dev.from(table).insert(rows.slice(i, i + SIZE));
      if (ins.error) {
        console.error(`✗ DEV insert ${table}: ${ins.error.message}`);
        process.exit(1);
      }
    }
  }

  // verify
  const { count } = await dev.from(table).select("*", { count: "exact", head: true });
  console.log(`✓ ${table}: prod ${rows.length} → dev ${count}`);
}

console.log("\nGotowe. DEV odzwierciedla teraz dane z PROD.");
