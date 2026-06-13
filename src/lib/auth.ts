export const AUTH_COOKIE = "aperolek_auth";
export const LOCKOUT_COOKIE = "aperolek_lockout";
export const MAX_ATTEMPTS = 5;
export const LOCKOUT_MINUTES = 15;

export function isAuthEnabled() {
  return Boolean(process.env.SITE_PASSWORD);
}

async function sha256hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Cookie stores a SHA-256 hash of the password, not the plaintext.
export async function authToken(password: string): Promise<string> {
  return sha256hex(`aperolek:${password}`);
}

// Lockout cookie format: "${attempts}.${windowStart}.${signature}"
// Signature uses SITE_PASSWORD as key — forgery requires knowing the password,
// at which point the lockout is moot anyway.
export async function signLockout(attempts: number, windowStart: number): Promise<string> {
  const secret = process.env.SITE_PASSWORD ?? "";
  const sig = await sha256hex(`aperolek-lockout:${attempts}.${windowStart}:${secret}`);
  return `${attempts}.${windowStart}.${sig}`;
}

export async function parseLockoutCookie(
  raw: string | undefined,
): Promise<{ attempts: number; windowStart: number } | null> {
  if (!raw) return null;
  const parts = raw.split(".");
  if (parts.length !== 3) return null;
  const attempts = Number(parts[0]);
  const windowStart = Number(parts[1]);
  if (!Number.isFinite(attempts) || !Number.isFinite(windowStart)) return null;
  const expected = await signLockout(attempts, windowStart);
  if (expected !== raw) return null;
  return { attempts, windowStart };
}

export function evaluateLockout(
  state: { attempts: number; windowStart: number } | null,
  now: number,
): { locked: boolean; retryAfterSec: number; attempts: number } {
  if (!state) return { locked: false, retryAfterSec: 0, attempts: 0 };
  const lockoutEndMs = state.windowStart + LOCKOUT_MINUTES * 60 * 1000;
  if (now >= lockoutEndMs) return { locked: false, retryAfterSec: 0, attempts: 0 };
  if (state.attempts >= MAX_ATTEMPTS) {
    return {
      locked: true,
      retryAfterSec: Math.ceil((lockoutEndMs - now) / 1000),
      attempts: state.attempts,
    };
  }
  return { locked: false, retryAfterSec: 0, attempts: state.attempts };
}
