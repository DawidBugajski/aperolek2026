"use client";

import { createContext, useCallback, useContext, useState } from "react";

type ToastKind = "error" | "success" | "info";
type Toast = { id: number; message: string; kind: ToastKind };

// Call signature: toast("Zapisano", "success")
const ToastCtx = createContext<(message: string, kind?: ToastKind) => void>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, kind: ToastKind = "info") => {
      const id = Date.now() + Math.random();
      setToasts((list) => [...list, { id, message, kind }]);
      setTimeout(() => remove(id), 4000);
    },
    [remove],
  );

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[200] flex flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => remove(t.id)}
            role="status"
            className={
              "pointer-events-auto max-w-md rounded-xl border-2 px-4 py-2.5 text-left text-sm font-medium shadow-md " +
              (t.kind === "error"
                ? "border-wine/40 bg-wine text-cream"
                : t.kind === "success"
                  ? "border-olive/40 bg-olive text-cream"
                  : "border-ink/30 bg-ink text-cream")
            }
          >
            {t.message}
          </button>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);
