import { login } from "./actions";
import { trip } from "@/data/trip";

export const metadata = { title: "Logowanie" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

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
            className="w-full border-2 border-ink/30 bg-cream px-4 py-2.5 text-center text-ink focus:border-terracotta focus:outline-none"
          />
          <button
            type="submit"
            className="w-full border-2 border-ink/40 bg-terracotta px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-cream"
          >
            Wejdź
          </button>
        </form>

        {error && (
          <p className="mt-4 text-sm text-wine">Nieprawidłowe hasło - spróbuj jeszcze raz.</p>
        )}
      </div>
    </div>
  );
}
