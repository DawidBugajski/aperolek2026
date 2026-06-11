"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isSupabaseConfigured, browserClient } from "@/lib/supabase";

// Live-sync the budget across devices. Any insert/update/delete on expenses or
// settlements triggers router.refresh(), which re-runs the /budzet server
// component and recomputes balances + "Do oddania". Renders nothing.
// Requires expenses & settlements to be in the supabase_realtime publication
// (see supabase/schema.sql).
export default function BudgetRealtime() {
  const router = useRouter();

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const sb = browserClient();
    const ch = sb
      .channel("budget")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "expenses" },
        () => router.refresh(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "settlements" },
        () => router.refresh(),
      )
      .subscribe();
    return () => {
      sb.removeChannel(ch);
    };
  }, [router]);

  return null;
}
