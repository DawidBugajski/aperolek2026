"use client";

import { createContext, useContext } from "react";

// true = guest mode (read-only)
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
