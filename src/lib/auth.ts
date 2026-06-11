// Prosta bramka: jedno wspólne hasło dla ekipy.
// Gdy SITE_PASSWORD nie jest ustawione -> bramka wyłączona (np. lokalnie).

export const AUTH_COOKIE = "aperolek_auth";

export function isAuthEnabled() {
  return Boolean(process.env.SITE_PASSWORD);
}

// Token w cookie = hash hasła (nie trzymamy hasła jawnie w cookie).
// Działa i w middleware (edge), i w Server Action (node) - Web Crypto.
export async function authToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`aperolek:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
