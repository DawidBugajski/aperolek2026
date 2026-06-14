"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { travelers } from "@/data/travelers";

const STORAGE_KEY = "aperolek:person";

export type Identity = { id: string; name: string; emoji: string } | null;

type IdentityCtx = {
  identity: Identity;
  ready: boolean;
  setIdentity: (id: string) => void;
  clear: () => void;
};

const Ctx = createContext<IdentityCtx>({
  identity: null,
  ready: false,
  setIdentity: () => {},
  clear: () => {},
});

export function IdentityProvider({ children }: { children: React.ReactNode }) {
  const [id, setId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      // localStorage is read on mount (client-only) to avoid hydration mismatch.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (v) setId(v);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const setIdentity = (value: string) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    setId(value);
  };

  const clear = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setId(null);
  };

  const t = travelers.find((x) => x.id === id) ?? null;
  const identity: Identity = t ? { id: t.id, name: t.name, emoji: t.emoji } : null;

  return (
    <Ctx.Provider value={{ identity, ready, setIdentity, clear }}>
      {children}
    </Ctx.Provider>
  );
}

export const useIdentity = () => useContext(Ctx);
