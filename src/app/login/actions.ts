"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  AUTH_COOKIE,
  LOCKOUT_COOKIE,
  LOCKOUT_MINUTES,
  MAX_ATTEMPTS,
  authToken,
  evaluateLockout,
  parseLockoutCookie,
  signLockout,
} from "@/lib/auth";

const SESSION_SECONDS = 60 * 60 * 24 * 60;
const LOCKOUT_SECONDS = LOCKOUT_MINUTES * 60;

export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const now = Date.now();
  const store = await cookies();

  const lockoutState = await parseLockoutCookie(store.get(LOCKOUT_COOKIE)?.value);
  const { locked, retryAfterSec, attempts } = evaluateLockout(lockoutState, now);

  if (locked) {
    redirect(`/login?locked=${retryAfterSec}`);
  }

  const full = process.env.SITE_PASSWORD;
  const guest = process.env.SITE_GUEST_PASSWORD;

  // Full-access or guest password — cookie stores the hash, not the plaintext.
  let token: string | null = null;
  if (full && password === full) token = await authToken(full);
  else if (guest && password === guest) token = await authToken(guest);

  if (token) {
    store.delete(LOCKOUT_COOKIE);
    store.set(AUTH_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_SECONDS,
    });
    redirect("/");
  }

  // Failed attempt — increment counter and persist signed cookie.
  // Re-anchor windowStart to now when hitting the cap so the 15-min lockout
  // is always measured from the moment the 5th failure fires, not the first.
  const windowStart = attempts === 0 ? now : (lockoutState?.windowStart ?? now);
  const newAttempts = attempts + 1;
  const effectiveWindowStart = newAttempts >= MAX_ATTEMPTS ? now : windowStart;
  const signed = await signLockout(newAttempts, effectiveWindowStart);
  store.set(LOCKOUT_COOKIE, signed, {
    httpOnly: true,
    sameSite: "lax",
    path: "/login",
    maxAge: LOCKOUT_SECONDS,
  });

  if (newAttempts >= MAX_ATTEMPTS) {
    redirect(`/login?locked=${LOCKOUT_SECONDS}`);
  }
  redirect("/login?error=1");
}
