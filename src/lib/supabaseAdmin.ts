import "server-only";
import { createClient } from "@supabase/supabase-js";

// Klient serwerowy (service role) - PEŁNY dostęp, omija RLS.
// Używany WYŁĄCZNIE w Server Actions / po stronie serwera. Nigdy w przeglądarce.
export function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) {
    throw new Error("Brak konfiguracji serwerowej Supabase (URL / SECRET_KEY).");
  }
  return createClient(url, secretKey, { auth: { persistSession: false } });
}
