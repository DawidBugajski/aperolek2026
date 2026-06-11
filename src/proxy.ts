import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, authToken } from "@/lib/auth";

// Bramka z hasłem (w Next 16 dawne "middleware" to teraz "proxy").
// Zapisy i tak są chronione po stronie serwera (assertCanWrite) - to tylko
// szybki redirect dla niezalogowanych.
export async function proxy(req: NextRequest) {
  const password = process.env.SITE_PASSWORD;
  // Bramka wyłączona, gdy brak hasła w env.
  if (!password) return NextResponse.next();

  const { pathname } = req.nextUrl;
  // Strona logowania zawsze dostępna.
  if (pathname.startsWith("/login")) return NextResponse.next();

  const cookie = req.cookies.get(AUTH_COOKIE)?.value;
  const guest = process.env.SITE_GUEST_PASSWORD;
  const allowed =
    cookie === (await authToken(password)) ||
    (guest ? cookie === (await authToken(guest)) : false);
  if (allowed) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  // Pomijamy zasoby statyczne; reszta (strony + Server Actions) przez bramkę.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg).*)"],
};
