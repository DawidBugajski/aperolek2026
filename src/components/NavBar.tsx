"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { sections } from "@/data/sections";
import { trip } from "@/data/trip";

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Bez nawigacji na ekranie logowania.
  if (pathname === "/login") return null;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const linkClass = (href: string) =>
    [
      "whitespace-nowrap border-b-2 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] transition-colors",
      isActive(href)
        ? "border-terracotta text-terracotta"
        : "border-transparent text-ink-soft hover:border-sand-dark hover:text-ink",
    ].join(" ");

  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink/40 bg-cream/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-display text-xl font-bold tracking-tight text-ink"
        >
          <span aria-hidden>🍹</span>
          <span>{trip.title}</span>
        </Link>

        {/* Desktop: jeden rząd, bez zawijania, w razie ciasnoty scroll poziomy */}
        <div className="no-scrollbar hidden flex-1 items-center justify-end gap-x-3 overflow-x-auto lg:flex">
          {sections.map((s) => (
            <Link key={s.slug} href={s.href} className={linkClass(s.href)}>
              {s.short}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="ml-auto border-2 border-ink/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink lg:hidden"
          aria-expanded={open}
        >
          {open ? "✕ Zamknij" : "☰ Menu"}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t-2 border-ink/30 bg-cream px-4 py-3 lg:hidden">
          <div className="grid grid-cols-2 gap-2">
            {sections.map((s) => (
              <Link
                key={s.slug}
                href={s.href}
                onClick={() => setOpen(false)}
                className={
                  "block border px-3 py-2 text-sm font-medium transition-colors " +
                  (isActive(s.href)
                    ? "border-terracotta bg-terracotta/10 text-terracotta"
                    : "border-sand-dark text-ink hover:bg-sand")
                }
              >
                <span className="mr-1" aria-hidden>{s.emoji}</span>
                {s.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
