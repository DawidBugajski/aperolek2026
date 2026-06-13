"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { sections } from "@/data/sections";
import LogoBadge from "@/components/LogoBadge";

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname === "/login") return null;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const linkClass = (href: string) =>
    [
      "whitespace-nowrap border-b-2 py-1 text-xs font-semibold uppercase tracking-[0.06em] transition-colors",
      isActive(href)
        ? "border-terracotta text-terracotta"
        : "border-transparent text-ink-soft hover:border-sand-dark hover:text-ink",
    ].join(" ");

  // Desktop: short items split around the centered logo; longer/secondary
  // ones (incl. full "Podsumowanie") go to a centered second row.
  const bottomSlugs = new Set(["mapa", "jedzenie", "info", "sos", "galeria", "podsumowanie"]);
  const topItems = sections.filter((s) => !bottomSlugs.has(s.slug));
  const restItems = sections.filter((s) => bottomSlugs.has(s.slug));
  const half = Math.ceil(topItems.length / 2);
  const leftItems = topItems.slice(0, half);
  const rightItems = topItems.slice(half);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink/40 bg-cream/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3">
        {/* Desktop: left links · centered logo · right links, rest below */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-5">
            <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1.5">
              {leftItems.map((s) => (
                <Link key={s.slug} href={s.href} className={linkClass(s.href)}>
                  {s.short}
                </Link>
              ))}
            </div>
            <Link
              href="/"
              className="flex shrink-0 items-center gap-2"
              aria-label="Aperolek 2026 – strona główna"
            >
              <LogoBadge />
            </Link>
            <div className="flex flex-wrap items-center justify-start gap-x-4 gap-y-1.5">
              {rightItems.map((s) => (
                <Link key={s.slug} href={s.href} className={linkClass(s.href)}>
                  {s.short}
                </Link>
              ))}
            </div>
          </div>
          {restItems.length > 0 && (
            <nav className="mt-2.5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {restItems.map((s) => (
                <Link key={s.slug} href={s.href} className={linkClass(s.href)}>
                  {s.short}
                </Link>
              ))}
            </nav>
          )}
        </div>

        {/* Mobile: brand + hamburger */}
        <div className="flex items-center justify-between gap-4 lg:hidden">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2"
            aria-label="Aperolek 2026 – strona główna"
          >
            <LogoBadge />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="border-2 border-ink/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink"
            aria-expanded={open}
          >
            {open ? "✕ Zamknij" : "☰ Menu"}
          </button>
        </div>
      </div>

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
