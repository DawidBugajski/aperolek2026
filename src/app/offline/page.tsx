export const metadata = { title: "Offline — Aperolek" };

export default function OfflinePage() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <h1 className="font-display text-3xl font-bold text-terracotta">Jesteś offline 📡</h1>
      <p className="mt-4 text-ink-soft">
        Aplikacja otworzyła się z pamięci urządzenia. Ostatnio oglądane strony powinny być widoczne,
        ale budżet na żywo i mapa wymagają połączenia z internetem.
      </p>
      <p className="mt-2 text-ink-soft">Połącz się z siecią i odśwież stronę.</p>
    </div>
  );
}
