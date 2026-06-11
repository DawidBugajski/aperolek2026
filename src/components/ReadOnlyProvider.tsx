"use client";

import { createContext, useContext } from "react";

// true = tryb gościa (podgląd, bez edycji)
const Ctx = createContext(false);

export function ReadOnlyProvider({
  isGuest,
  children,
}: {
  isGuest: boolean;
  children: React.ReactNode;
}) {
  return <Ctx.Provider value={isGuest}>{children}</Ctx.Provider>;
}

export const useReadOnly = () => useContext(Ctx);
