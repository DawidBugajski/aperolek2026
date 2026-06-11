import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Fraunces } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import IdentityBar from "@/components/IdentityBar";
import IdentityGate from "@/components/IdentityGate";
import { IdentityProvider } from "@/components/IdentityProvider";
import { ReadOnlyProvider } from "@/components/ReadOnlyProvider";
import { getRole } from "@/lib/session";
import { trip } from "@/data/trip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: `${trip.title} - ${trip.subtitle}`,
  description: "Prywatne centrum dowodzenia wyjazdem do Rzymu, Pizy i Lukki.",
  // Private site — keep out of search engines.
  robots: { index: false, follow: false },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const role = await getRole();
  const isGuest = role === "guest";

  return (
    <html
      lang="pl"
      className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ReadOnlyProvider isGuest={isGuest}>
        <IdentityProvider>
          <NavBar />
          <IdentityBar />
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
            <IdentityGate>{children}</IdentityGate>
          </main>
          <footer className="border-t-2 border-ink/30 px-4 py-6 text-center">
            <p className="kicker text-[11px]">Aperolek · M·M·XX·VI</p>
            <p className="mt-2 text-sm text-ink-soft">
              {trip.subtitle} · zrobione z 🧡 na wyjazd ekipy
            </p>
          </footer>
        </IdentityProvider>
        </ReadOnlyProvider>
      </body>
    </html>
  );
}
