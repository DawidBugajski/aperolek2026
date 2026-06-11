import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Czy baza jest skonfigurowana? Jeśli nie - aplikacja działa na localStorage (fallback).
export const isSupabaseConfigured = Boolean(url && publishableKey);

// Klient przeglądarkowy (publishable) - do odczytu i realtime. Tylko gdy skonfigurowane.
export function browserClient() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase nie jest skonfigurowane (brak NEXT_PUBLIC_SUPABASE_URL / PUBLISHABLE_KEY).",
    );
  }
  return createClient(url!, publishableKey!, { auth: { persistSession: false } });
}
