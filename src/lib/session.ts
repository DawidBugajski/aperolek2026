import "server-only";
import { cookies } from "next/headers";
import { AUTH_COOKIE, authToken } from "./auth";

// Rola odczytana z cookie: "full" (ekipa), "guest" (podgląd), null (niezalogowany).
export async function getRole(): Promise<"full" | "guest" | null> {
  const full = process.env.SITE_PASSWORD;
  if (!full) return "full"; // bramka wyłączona -> pełny dostęp (np. lokalnie bez hasła)

  const store = await cookies();
  const cookie = store.get(AUTH_COOKIE)?.value;
  if (!cookie) return null;

  if (cookie === (await authToken(full))) return "full";

  const guest = process.env.SITE_GUEST_PASSWORD;
  if (guest && cookie === (await authToken(guest))) return "guest";

  return null;
}

// Blokada zapisu dla gościa - wołana na początku każdej akcji modyfikującej dane.
export async function assertCanWrite() {
  const role = await getRole();
  if (role !== "full") {
    throw new Error("Tryb gościa - edycja jest wyłączona.");
  }
}
