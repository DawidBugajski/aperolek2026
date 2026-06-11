import "server-only";
import { cookies } from "next/headers";
import { AUTH_COOKIE, authToken } from "./auth";

// Role derived from cookie: "full" (crew), "guest" (read-only), null (not logged in).
export async function getRole(): Promise<"full" | "guest" | null> {
  const full = process.env.SITE_PASSWORD;
  if (!full) return "full"; // no password set — gate disabled, grant full access

  const store = await cookies();
  const cookie = store.get(AUTH_COOKIE)?.value;
  if (!cookie) return null;

  if (cookie === (await authToken(full))) return "full";

  const guest = process.env.SITE_GUEST_PASSWORD;
  if (guest && cookie === (await authToken(guest))) return "guest";

  return null;
}

// Guard called at the start of every mutating server action.
export async function assertCanWrite() {
  const role = await getRole();
  if (role !== "full") {
    throw new Error("Guest mode — editing is disabled.");
  }
}
