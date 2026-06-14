"use client";

import { useCallback, useEffect, useState } from "react";
import { useIdentity } from "@/components/IdentityProvider";
import { useReadOnly } from "@/components/ReadOnlyProvider";
import { isSupabaseConfigured, browserClient } from "@/lib/supabase";
import { getEntries, addEntry, updateEntry, deleteEntry, type Entry } from "@/app/actions/entries";
import { getChecks, setCheck } from "@/app/actions/checks";
import { SkeletonList } from "@/components/Skeleton";
import { useToast } from "@/components/ToastProvider";

const inputClass =
  "w-full border border-ink/25 bg-cream px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none";

// Checklist with both check-off and item editing.
// Entries (scope) are shared; checks are per-person (perPerson=true) or shared.
export default function EditableChecklist({
  scope,
  perPerson,
}: {
  scope: string;
  perPerson: boolean;
}) {
  const { identity, ready } = useIdentity();
  const readOnly = useReadOnly();
  const person = perPerson ? identity?.id ?? null : "shared";

  const toast = useToast();
  const [items, setItems] = useState<Entry[]>([]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [detail, setDetail] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    try {
      setItems(await getEntries(scope));
    } catch (e) {
      toast(e instanceof Error ? e.message : "Błąd wczytywania.", "error");
    }
  }, [scope, toast]);

  const loadChecks = useCallback(async () => {
    if (!person) return;
    try {
      setChecked(await getChecks(scope, person));
    } catch {
      /* ignore */
    }
  }, [scope, person]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      toast("Baza nie jest skonfigurowana.", "error");
      return;
    }
    (async () => {
      await loadItems();
      await loadChecks();
      setLoading(false);
    })();
  }, [loadItems, loadChecks, toast]);

  // realtime: entries
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const sb = browserClient();
    const ch = sb
      .channel(`items:${scope}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "entries", filter: `scope=eq.${scope}` },
        () => loadItems(),
      )
      .subscribe();
    return () => {
      sb.removeChannel(ch);
    };
  }, [scope, loadItems]);

  // realtime: check states
  useEffect(() => {
    if (!isSupabaseConfigured || !person) return;
    const sb = browserClient();
    const ch = sb
      .channel(`checks:${scope}:${person}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "checks", filter: `person=eq.${person}` },
        (payload) => {
          const row = payload.new as { scope?: string; item?: string; checked?: boolean };
          if (row?.scope === scope && row.item) {
            setChecked((prev) => ({ ...prev, [row.item!]: !!row.checked }));
          }
        },
      )
      .subscribe();
    return () => {
      sb.removeChannel(ch);
    };
  }, [scope, person]);

  const toggle = (id: string) => {
    if (!person) return;
    const next = !checked[id];
    setChecked((p) => ({ ...p, [id]: next }));
    setCheck(scope, person, id, next, identity?.name ?? person).catch(() =>
      setChecked((p) => ({ ...p, [id]: !next })),
    );
  };

  const resetForm = () => {
    setText("");
    setDetail("");
    setAdding(false);
    setEditingId(null);
  };
  const startEdit = (it: Entry) => {
    setText(String(it.data.text ?? ""));
    setDetail(String(it.data.detail ?? ""));
    setEditingId(it.id);
    setAdding(false);
  };
  const save = async () => {
    if (saving) return;
    if (!text.trim()) {
      toast("Podaj treść pozycji.", "error");
      return;
    }
    setSaving(true);
    try {
      const data = { text: text.trim(), detail: detail.trim() };
      const by = identity?.name ?? null;
      if (editingId) await updateEntry(editingId, data, by);
      else await addEntry(scope, data, by);
      resetForm();
      await loadItems();
      toast("Zapisano.", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Błąd zapisu.", "error");
    } finally {
      setSaving(false);
    }
  };
  const remove = async (id: string) => {
    if (!confirm("Usunąć pozycję?")) return;
    setDeletingId(id);
    try {
      await deleteEntry(id);
      await loadItems();
      toast("Usunięto.", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Błąd usuwania.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  if (perPerson && readOnly) {
    return (
      <p className="rounded-xl border border-dashed border-sand-dark bg-cream px-4 py-3 text-sm text-ink-soft">
        Tryb gościa - listy pakowania są indywidualne dla ekipy.
      </p>
    );
  }
  if (perPerson && ready && !person) {
    return (
      <p className="rounded-xl border border-dashed border-sand-dark bg-cream px-4 py-3 text-sm text-ink-soft">
        Wybierz u góry, kim jesteś, żeby zobaczyć i odhaczać swoją listę. 👆
      </p>
    );
  }
  if (loading) return <SkeletonList />;

  const form = (
    <div className="postcard space-y-2 p-3">
      <input
        className={inputClass}
        value={text}
        placeholder="Co spakować / kupić"
        onChange={(e) => setText(e.target.value)}
      />
      <input
        className={inputClass}
        value={detail}
        placeholder="Szczegół (opcjonalnie)"
        onChange={(e) => setDetail(e.target.value)}
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="border-2 border-ink/40 bg-terracotta px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-cream disabled:opacity-50"
        >
          {saving ? "Zapisywanie…" : "Zapisz"}
        </button>
        <button
          type="button"
          onClick={resetForm}
          className="border-2 border-ink/25 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink-soft hover:text-ink"
        >
          Anuluj
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-2">
      {items.map((it) =>
        editingId === it.id ? (
          <div key={it.id}>{form}</div>
        ) : (
          <div
            key={it.id}
            className="flex items-start gap-3 rounded-xl border border-sand-dark bg-cream px-4 py-3"
          >
            <input
              type="checkbox"
              checked={!!checked[it.id]}
              onChange={() => toggle(it.id)}
              disabled={readOnly}
              className="mt-1 h-5 w-5 shrink-0 accent-terracotta disabled:cursor-not-allowed disabled:opacity-40"
            />
            <span className="min-w-0 flex-1">
              <span className={checked[it.id] ? "text-ink-soft line-through" : "text-ink"}>
                {String(it.data.text ?? "")}
              </span>
              {it.data.detail ? (
                <span className="block text-sm text-ink-soft">{String(it.data.detail)}</span>
              ) : null}
              {it.data._by ? (
                <span className="block text-[11px] text-ink-soft/60">✎ {String(it.data._by)}</span>
              ) : null}
            </span>
            <span className="flex shrink-0 gap-2 text-xs">
              <button
                type="button"
                onClick={() => startEdit(it)}
                disabled={readOnly || deletingId === it.id}
                className="text-ink-soft hover:text-terracotta disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-ink-soft"
              >
                edytuj
              </button>
              <button
                type="button"
                onClick={() => remove(it.id)}
                disabled={readOnly || deletingId === it.id}
                className="text-ink-soft/70 hover:text-wine disabled:cursor-not-allowed disabled:opacity-40"
              >
                {deletingId === it.id ? "usuwanie…" : "usuń"}
              </button>
            </span>
          </div>
        ),
      )}

      {adding ? (
        form
      ) : (
        <button
          type="button"
          onClick={() => {
            resetForm();
            setAdding(true);
          }}
          disabled={readOnly}
          className="border-2 border-dashed border-ink/30 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink-soft hover:border-terracotta hover:text-terracotta disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-ink/30 disabled:hover:text-ink-soft"
        >
          + Dodaj pozycję
        </button>
      )}
    </div>
  );
}
