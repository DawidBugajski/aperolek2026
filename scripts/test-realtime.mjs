// Verifies APR-004: expenses & settlements are in the supabase_realtime
// publication, so the browser receives live events.
//
// Subscribes with the PUBLISHABLE key (exactly like the browser does), then
// writes a test row with the SECRET key and waits for the realtime event.
//
// Run with:  node --env-file=.env.local scripts/test-realtime.mjs
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const pub = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const secret = process.env.SUPABASE_SECRET_KEY;

if (!url || !pub || !secret) {
  console.error("Missing env (URL / PUBLISHABLE / SECRET).");
  process.exit(1);
}

const browser = createClient(url, pub, { auth: { persistSession: false } });
const admin = createClient(url, secret, { auth: { persistSession: false } });

const TAG = "__realtime_test__";
const got = { expenses: false, settlements: false };

function waitFor(predicate, ms) {
  return new Promise((resolve) => {
    const t = setInterval(() => {
      if (predicate()) {
        clearInterval(t);
        resolve(true);
      }
    }, 100);
    setTimeout(() => {
      clearInterval(t);
      resolve(false);
    }, ms);
  });
}

const ch = browser
  .channel("budget-test")
  .on("postgres_changes", { event: "*", schema: "public", table: "expenses" }, (p) => {
    console.log("  ← event: expenses", p.eventType);
    got.expenses = true;
  })
  .on("postgres_changes", { event: "*", schema: "public", table: "settlements" }, (p) => {
    console.log("  ← event: settlements", p.eventType);
    got.settlements = true;
  });

const subscribed = await new Promise((resolve) => {
  ch.subscribe((status) => {
    console.log("channel status:", status);
    if (status === "SUBSCRIBED") resolve(true);
    if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") resolve(false);
  });
});

if (!subscribed) {
  console.error("✗ Could not subscribe to realtime channel.");
  process.exit(1);
}

console.log("\nwriting test rows (admin)…");
const exp = await admin.from("expenses").insert({
  date: "2026-01-01",
  title: TAG,
  category: "inne",
  amount: 1,
  paid_by: "dawid",
});
console.log("  insert expenses:", exp.error ? `ERROR -> ${exp.error.message}` : "OK");

const set = await admin.from("settlements").insert({
  from_person: "dawid",
  to_person: "karolina",
  amount: 1,
  note: TAG,
});
console.log("  insert settlements:", set.error ? `ERROR -> ${set.error.message}` : "OK");

console.log("\nwaiting up to 10s for realtime events…");
await waitFor(() => got.expenses && got.settlements, 10000);

console.log("\ncleanup…");
const d1 = await admin.from("expenses").delete().eq("title", TAG);
const d2 = await admin.from("settlements").delete().eq("note", TAG);
console.log("  delete expenses:", d1.error ? `ERROR -> ${d1.error.message}` : "OK");
console.log("  delete settlements:", d2.error ? `ERROR -> ${d2.error.message}` : "OK");

// give the delete events a moment too
await waitFor(() => false, 1500);

await browser.removeChannel(ch);

console.log("\n=== RESULT ===");
console.log("expenses realtime:   ", got.expenses ? "✓ PASS" : "✗ FAIL (not in publication?)");
console.log("settlements realtime:", got.settlements ? "✓ PASS" : "✗ FAIL (not in publication?)");
process.exit(got.expenses && got.settlements ? 0 : 1);
