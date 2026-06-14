import { login } from "./actions";
import { trip } from "@/data/trip";

export const metadata = { title: "Logowanie" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; locked?: string }>;
}) {
  const { error, locked } = await searchParams;
  const lockedMin = locked ? Math.min(Math.ceil(Number(locked) / 60), 60) : 0;
  const isLocked = lockedMin > 0;

  return (
    <div className="bg-paper flex min-h-screen items-center justify-center px-4">
      <div className="frame-double w-full max-w-sm bg-paper px-8 py-10 text-center">
        <p className="kicker text-xs">✦ Visita Italia ✦</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-ink">{trip.title}</h1>
        <p className="mt-2 text-sm text-ink-soft">Strona dla ekipy - podaj wspólne hasło.</p>

        <form action={login} className="mt-6 space-y-3">
          <input
            type="password"
            name="password"
            placeholder="Hasło"
            autoFocus
            required
            disabled={isLocked}
            className="w-full border-2 border-ink/30 bg-cream px-4 py-2.5 text-center text-ink focus:border-terracotta focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isLocked}
            className="w-full border-2 border-ink/40 bg-terracotta px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-cream disabled:cursor-not-allowed disabled:opacity-60"
          >
            Wejdź
          </button>
        </form>

        {isLocked && (
          <p className="mt-4 text-sm text-wine">
            Za dużo prób. Spróbuj ponownie za ~{lockedMin} min.
          </p>
        )}
        {!isLocked && error && (
          <p className="mt-4 text-sm text-wine">Nieprawidłowe hasło - spróbuj jeszcze raz.</p>
        )}
        <p className="mt-6 text-xs text-ink-soft">
          Chcesz tylko zerknąć? Hasło gościa:{" "}
          <span className="font-semibold text-ink">guest</span> (podgląd, bez edycji).
        </p>
      </div>
    </div>
  );
}
