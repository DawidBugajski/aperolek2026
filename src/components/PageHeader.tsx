import Link from "next/link";

export default function PageHeader({
  emoji,
  title,
  desc,
}: {
  emoji: string;
  title: string;
  desc?: string;
}) {
  return (
    <header className="mb-8">
      <Link
        href="/"
        className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft hover:text-terracotta"
      >
        ← Powrót
      </Link>
      <div className="mt-4 flex items-center gap-4">
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-ink/30 bg-cream text-2xl"
          aria-hidden
        >
          {emoji}
        </span>
        <div>
          <h1 className="font-display text-3xl font-bold leading-none text-ink sm:text-4xl">
            {title}
          </h1>
        </div>
      </div>
      <div className="rule-fancy mt-4" />
      {desc && <p className="mt-3 max-w-2xl text-ink-soft">{desc}</p>}
    </header>
  );
}
