import Link from "next/link";
import Countdown from "@/components/Countdown";
import StampBadge from "@/components/StampBadge";
import { trip } from "@/data/trip";
import { sections } from "@/data/sections";
import { travelers } from "@/data/travelers";

const routeCities = ["Roma", "Pisa", "Lucca"];

export default function Home() {
  return (
    <div className="space-y-14">
      <section className="relative">
        <StampBadge
          top="Partenza"
          big="25.07"
          bottom="Luglio '26"
          className="absolute -right-1 -top-5 z-10 flex rotate-12 bg-cream/60 sm:-top-6"
        />

        <div className="frame-double bg-paper px-6 py-10 text-center sm:px-12 sm:py-14">
          <p className="kicker text-xs sm:text-sm">✦ Visita Italia ✦</p>

          <h1 className="mt-4 font-display text-6xl font-bold leading-[0.9] tracking-tight text-ink sm:text-8xl">
            Aperolek <span className="text-terracotta">2026</span>
          </h1>

          <div className="mt-6 flex items-center justify-center gap-3 text-sm font-semibold uppercase tracking-[0.25em] text-ink-soft">
            {routeCities.map((c, i) => (
              <span key={c} className="flex items-center gap-3">
                {i > 0 && <span className="text-terracotta">✈</span>}
                {c}
              </span>
            ))}
          </div>

          <p className="mt-4 text-base text-ink-soft">
            25-31 lipca 2026 · wyjazd ekipy do Włoch 🇮🇹
          </p>

          <div className="mx-auto mt-8 max-w-md">
            <div className="rule-fancy" />
            <p className="kicker my-4 text-[11px]">Do wylotu zostało</p>
            <Countdown targetIso={trip.startDate} />
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {travelers.map((t) => (
              <span
                key={t.id}
                className="border border-ink/20 bg-cream px-3 py-1 text-sm font-medium text-ink"
                title={`${t.name} - ${t.homeCity}`}
              >
                <span className="mr-1" aria-hidden>{t.emoji}</span>
                {t.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center gap-4">
          <h2 className="font-display text-2xl font-bold text-ink">Itinerario</h2>
          <div className="rule-fancy flex-1" />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s, i) => (
            <Link
              key={s.slug}
              href={s.href}
              className="postcard group relative block p-5 transition-transform duration-200 hover:-translate-y-1 hover:-rotate-1"
            >
              <span className="absolute right-4 top-3 font-display text-sm font-bold text-ink/25">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex items-center gap-3">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink/25 bg-cream text-xl"
                  aria-hidden
                >
                  {s.emoji}
                </span>
                <h3 className="font-display text-xl font-bold text-ink group-hover:text-terracotta">
                  {s.title}
                </h3>
              </div>
              <p className="mt-3 text-sm text-ink-soft">{s.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
