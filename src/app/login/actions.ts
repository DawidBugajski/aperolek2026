"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE, authToken } from "@/lib/auth";

// Jak długo pamiętamy zalogowanie (w sekundach).
// 60 * 60 * 24 * 60 = 60 dni. Do testu wygasania zmień np. na 20.
const SESSION_SECONDS = 60 * 60 * 24 * 60;
//dev test only
//const TEST_SESSION_SECONDS = 20


export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const full = process.env.SITE_PASSWORD;
  const guest = process.env.SITE_GUEST_PASSWORD;

  // Hasło ekipy lub hasło gościa - cookie trzyma hash odpowiedniego hasła.
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
      // maxAge: TEST_SESSION_SECONDS, - dev only
    });
    redirect("/");
  }

  redirect("/login?error=1");
}
