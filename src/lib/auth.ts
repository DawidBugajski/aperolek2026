export const AUTH_COOKIE = "aperolek_auth";

export function isAuthEnabled() {
  return Boolean(process.env.SITE_PASSWORD);
}

// Cookie stores a SHA-256 hash of the password, not the plaintext.
export async function authToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`aperolek:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
