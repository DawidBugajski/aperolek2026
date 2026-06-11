import "server-only";
import { createClient } from "@supabase/supabase-js";

// Server-side client (secret key) — full access, bypasses RLS.
// Use only in Server Actions, never in browser code.
export function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) {
    throw new Error("Missing Supabase server config (URL / SECRET_KEY).");
  }
  return createClient(url, secretKey, { auth: { persistSession: false } });
}
