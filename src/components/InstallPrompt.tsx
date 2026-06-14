"use client";

import { useEffect, useState } from "react";

const DISMISS_KEY = "aperolek:install-dismissed";

type BIPEvent = Event & { prompt: () => Promise<void> };

export default function InstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISS_KEY) === "1";
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    if (dismissed || standalone) return;

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (ios) {
      // Client-only platform detection; must run after mount to avoid hydration mismatch.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsIOS(true);
      setVisible(true);
    }

    const onBIP = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", onBIP);
    return () => window.removeEventListener("beforeinstallprompt", onBIP);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    dismiss();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md border-2 border-ink/30 bg-cream p-4 text-sm text-ink shadow-[3px_3px_0_rgba(58,44,29,0.15)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display font-semibold text-terracotta">Dodaj Aperolka na ekran główny</p>
          {isIOS ? (
            <p className="mt-1 text-ink-soft">
              Stuknij <span aria-hidden>⎋</span> Udostępnij, a potem „Do ekranu początkowego”.
            </p>
          ) : (
            <p className="mt-1 text-ink-soft">Zainstaluj jako apkę — szybki dostęp i działa offline.</p>
          )}
        </div>
        <button onClick={dismiss} aria-label="Zamknij" className="shrink-0 text-ink-soft hover:text-ink">
          ✕
        </button>
      </div>
      {!isIOS && deferred && (
        <button
          onClick={install}
          className="mt-3 w-full border-2 border-ink/30 bg-terracotta px-3 py-2 font-semibold text-cream"
        >
          Zainstaluj aplikację
        </button>
      )}
    </div>
  );
}
