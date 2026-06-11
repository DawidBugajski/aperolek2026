"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE, authToken } from "@/lib/auth";

// Session duration in seconds: 60 days.
const SESSION_SECONDS = 60 * 60 * 24 * 60;

export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const full = process.env.SITE_PASSWORD;
  const guest = process.env.SITE_GUEST_PASSWORD;

  // Full-access or guest password — cookie stores the hash, not the plaintext.
  let token: string | null = null;
  if (full && password === full) token = await authToken(full);
  else if (guest && password === guest) token = await authToken(guest);

  if (token) {
    const store = await cookies();
    store.set(AUTH_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_SECONDS,
    });
    redirect("/");
  }

  redirect("/login?error=1");
}
