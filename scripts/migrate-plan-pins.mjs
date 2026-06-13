// Migrates existing `plan:*` entries in Supabase by enriching their `data`
// with coordinates (lat, lng, place_type) matched from the places list.
//
// Usage:
//   SUPABASE_URL=<supabase-url> SUPABASE_KEY=<secret-key> node scripts/migrate-plan-pins.mjs
//
// Idempotent: entries that already have a numeric `data.lat` are skipped.
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing SUPABASE_URL / SUPABASE_KEY env vars.");
  process.exit(1);
}

const PLACES = [
  { name: "Nocleg w Rzymie", type: "nocleg", lat: 41.8967, lng: 12.4822 },
  { name: "Koloseum", type: "atrakcja", lat: 41.8902, lng: 12.4922 },
  { name: "Forum Romanum", type: "atrakcja", lat: 41.8925, lng: 12.4853 },
  { name: "Panteon", type: "atrakcja", lat: 41.8986, lng: 12.4769 },
  { name: "Fontanna di Trevi", type: "atrakcja", lat: 41.9009, lng: 12.4833 },
  { name: "Piazza Navona", type: "atrakcja", lat: 41.8992, lng: 12.4731 },
  { name: "Bazylika św. Piotra (Watykan)", type: "atrakcja", lat: 41.9022, lng: 12.4539 },
  { name: "Muzea Watykańskie", type: "atrakcja", lat: 41.9065, lng: 12.4534 },
  { name: "Trastevere", type: "jedzenie", lat: 41.889, lng: 12.469 },
  { name: "Nocleg w Pizie", type: "nocleg", lat: 43.716, lng: 10.396 },
  { name: "Krzywa Wieża", type: "atrakcja", lat: 43.723, lng: 10.3966 },
  { name: "Piazza dei Miracoli", type: "atrakcja", lat: 43.7232, lng: 10.3936 },
  { name: "Borgo Stretto", type: "jedzenie", lat: 43.7185, lng: 10.4015 },
  { name: "Mury miejskie", type: "atrakcja", lat: 43.843, lng: 10.502 },
  { name: "Piazza dell'Anfiteatro", type: "atrakcja", lat: 43.8447, lng: 10.5065 },
  { name: "Torre Guinigi", type: "atrakcja", lat: 43.8432, lng: 10.5048 },
];

function findMatch(entryText) {
  const text = entryText.toLowerCase();
  for (const place of PLACES) {
    // Strip parenthetical from place name for better matching
    const baseName = place.name.replace(/\s*\(.*\)/, "").toLowerCase();
    if (text.includes(baseName)) return place;
  }
  return null;
}

const sb = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

const { data: entries, error } = await sb
  .from("entries")
  .select("*")
  .like("scope", "plan:%");

if (error) {
  console.error("Failed to fetch entries:", error.message);
  process.exit(1);
}

if (!entries || entries.length === 0) {
  console.log("Brak wpisów plan:* w bazie");
  process.exit(0);
}

let checked = 0;
let updated = 0;
const skippedNoMatch = [];
const skippedHasCoords = [];

for (const entry of entries) {
  checked += 1;
  const data = entry.data ?? {};

  if (typeof data.lat === "number") {
    skippedHasCoords.push(data.text ?? entry.id);
    continue;
  }

  const match = findMatch(String(data.text ?? ""));
  if (!match) {
    skippedNoMatch.push(data.text ?? entry.id);
    continue;
  }

  const newData = {
    ...data,
    lat: match.lat,
    lng: match.lng,
    place_type: match.type,
  };

  const { error: updErr } = await sb
    .from("entries")
    .update({ data: newData })
    .eq("id", entry.id);

  if (updErr) {
    console.log(`UPDATE ERROR (${entry.id}): ${updErr.message}`);
    continue;
  }

  updated += 1;
  console.log(`OK  [${entry.scope}] "${data.text}" -> ${match.name} (${match.lat}, ${match.lng}, ${match.type})`);
}

console.log("\n--- Podsumowanie ---");
console.log(`Sprawdzono wpisów:        ${checked}`);
console.log(`Zaktualizowano:           ${updated}`);
console.log(`Pominięto (mają już lat): ${skippedHasCoords.length}`);
console.log(`Pominięto (brak matcha):  ${skippedNoMatch.length}`);
if (skippedNoMatch.length > 0) {
  console.log("\nBez dopasowania:");
  for (const t of skippedNoMatch) console.log(`  - ${t}`);
}

// Aby uruchomić na PROD:
// SUPABASE_URL=<prod-url> SUPABASE_KEY=<prod-secret-key> node scripts/migrate-plan-pins.mjs
