import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, authToken } from "@/lib/auth";

// Password gate (Next 16 uses "proxy" instead of "middleware").
// Writes are also protected server-side via assertCanWrite — this just
// redirects unauthenticated users before they see any page.
export async function proxy(req: NextRequest) {
  const password = process.env.SITE_PASSWORD;
  if (!password) return NextResponse.next();

  const { pathname } = req.nextUrl;
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
  // Skip static assets and PWA entry points (SW + manifest + icons must be
  // fetchable while logged out so install/offline works); everything else
  // goes through the gate.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|sw.js|manifest.webmanifest|apple-icon|icons/).*)",
  ],
};
