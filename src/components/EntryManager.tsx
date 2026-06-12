"use client";

import { useCallback, useEffect, useState } from "react";
import { isSupabaseConfigured, browserClient } from "@/lib/supabase";
import { useReadOnly } from "@/components/ReadOnlyProvider";
import { useIdentity } from "@/components/IdentityProvider";
import { SkeletonList } from "@/components/Skeleton";
import { useToast } from "@/components/ToastProvider";
import {
  getEntries,
  addEntry,
  updateEntry,
  deleteEntry,
  type Entry,
} from "@/app/actions/entries";

export type Field = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "select";
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
};

type Data = Record<string, unknown>;

function fmtDate(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit" });
}

const inputClass =
  "w-full border border-ink/25 bg-cream px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none";

export default function EntryManager({
  scope,
  fields,
  renderItem,
  addLabel = "+ Dodaj",
  emptyText = "Jeszcze pusto - dodaj pierwszą pozycję.",
}: {
  scope: string;
  fields: Field[];
  renderItem: (data: Data) => React.ReactNode;
  addLabel?: string;
  emptyText?: string;
}) {
  const readOnly = useReadOnly();
  const { identity } = useIdentity();
  const toast = useToast();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      const rows = await getEntries(scope);
      setEntries(rows);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Błąd wczytywania.", "error");
    } finally {
      setLoading(false);
    }
  }, [scope, toast]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      toast("Baza nie jest skonfigurowana.", "error");
      return;
    }
    refetch();
  }, [refetch, toast]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const sb = browserClient();
    const ch = sb
      .channel(`entries:${scope}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "entries", filter: `scope=eq.${scope}` },
        () => refetch(),
      )
      .subscribe();
    return () => {
      sb.removeChannel(ch);
    };
  }, [scope, refetch]);

  const startAdd = () => {
    const blank: Record<string, string> = {};
    fields.forEach((f) => {
      blank[f.key] = f.type === "select" && f.options?.length ? f.options[0].value : "";
    });
    setForm(blank);
    setEditingId(null);
    setAdding(true);
  };

  const startEdit = (entry: Entry) => {
    const f: Record<string, string> = {};
    fields.forEach((fl) => {
      f[fl.key] = entry.data[fl.key] != null ? String(entry.data[fl.key]) : "";
    });
    setForm(f);
    setAdding(false);
    setEditingId(entry.id);
  };

  const cancel = () => {
    setAdding(false);
    setEditingId(null);
  };

  const buildData = (): Data => {
    const d: Data = {};
    fields.forEach((f) => {
      const raw = form[f.key] ?? "";
      d[f.key] = f.type === "number" ? Number(String(raw).replace(",", ".")) : raw;
    });
    return d;
  };

  const save = async () => {
    for (const f of fields) {
      if (f.required && !String(form[f.key] ?? "").trim()) {
        toast(`Uzupełnij: ${f.label}`, "error");
        return;
      }
    }
    setSaving(true);
    try {
      const by = identity?.name ?? null;
      if (editingId) await updateEntry(editingId, buildData(), by);
      else await addEntry(scope, buildData(), by);
      cancel();
      await refetch();
      toast("Zapisano.", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Błąd zapisu.", "error");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Usunąć tę pozycję?")) return;
    setDeletingId(id);
    try {
      await deleteEntry(id);
      await refetch();
      toast("Usunięto.", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Błąd usuwania.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const renderForm = () => (
    <div className="postcard space-y-3 p-4">
      {fields.map((f) => (
        <label key={f.key} className="block text-sm">
          <span className="mb-1 block text-ink-soft">{f.label}</span>
          {f.type === "textarea" ? (
            <textarea
              rows={3}
              className={inputClass}
              value={form[f.key] ?? ""}
              placeholder={f.placeholder}
              onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
            />
          ) : f.type === "select" ? (
            <select
              className={inputClass}
              value={form[f.key] ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
            >
              {f.options?.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              inputMode={f.type === "number" ? "decimal" : undefined}
              className={inputClass}
              value={form[f.key] ?? ""}
              placeholder={f.placeholder}
              onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
            />
          )}
        </label>
      ))}
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
          onClick={cancel}
          className="border-2 border-ink/25 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink-soft hover:text-ink"
        >
          Anuluj
        </button>
      </div>
    </div>
  );

  if (loading) return <SkeletonList />;

  return (
    <div className="space-y-3">
      {entries.length === 0 && !adding && (
        <p className="rounded-xl border border-dashed border-sand-dark bg-cream px-4 py-3 text-sm text-ink-soft">
          {emptyText}
        </p>
      )}

      <div className="space-y-2">
        {entries.map((entry) =>
          editingId === entry.id ? (
            <div key={entry.id}>{renderForm()}</div>
          ) : (
            <div
              key={entry.id}
              className="flex items-start justify-between gap-3 rounded-xl border border-sand-dark bg-white/70 px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                {renderItem(entry.data)}
                {entry.data._by ? (
                  <span className="mt-1 block text-[11px] text-ink-soft/60">
                    ✎ {String(entry.data._by)}
                    {entry.data._at ? ` · ${fmtDate(String(entry.data._at))}` : ""}
                  </span>
                ) : null}
              </div>
              <div className="flex shrink-0 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => startEdit(entry)}
                  disabled={readOnly || deletingId === entry.id}
                  className="text-ink-soft hover:text-terracotta disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-ink-soft"
                >
                  edytuj
                </button>
                <button
                  type="button"
                  onClick={() => remove(entry.id)}
                  disabled={readOnly || deletingId === entry.id}
                  className="text-ink-soft/70 hover:text-wine disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {deletingId === entry.id ? "usuwanie…" : "usuń"}
                </button>
              </div>
            </div>
          ),
        )}
      </div>

      {adding ? (
        renderForm()
      ) : (
        <button
          type="button"
          onClick={startAdd}
          disabled={readOnly}
          className="border-2 border-dashed border-ink/30 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ink-soft hover:border-terracotta hover:text-terracotta disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-ink/30 disabled:hover:text-ink-soft"
        >
          {addLabel}
        </button>
      )}
    </div>
  );
}
