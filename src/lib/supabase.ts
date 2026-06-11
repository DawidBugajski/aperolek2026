import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// When not configured, the app falls back to localStorage.
export const isSupabaseConfigured = Boolean(url && publishableKey);

// Browser client (publishable key) — for reads and realtime subscriptions.
export function browserClient() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured (missing NEXT_PUBLIC_SUPABASE_URL / PUBLISHABLE_KEY).",
    );
  }
  return createClient(url!, publishableKey!, { auth: { persistSession: false } });
}
