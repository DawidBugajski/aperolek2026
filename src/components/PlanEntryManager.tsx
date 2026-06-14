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

type Data = Record<string, unknown>;

const PLACE_TYPES: { value: string; label: string }[] = [
  { value: "atrakcja", label: "atrakcja" },
  { value: "jedzenie", label: "jedzenie" },
  { value: "nocleg", label: "nocleg" },
];

function fmtDate(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit" });
}

function hasCoords(d: Data): boolean {
  const lat = Number(String(d.lat ?? "").toString().replace(",", "."));
  const lng = Number(String(d.lng ?? "").toString().replace(",", "."));
  return (
    String(d.lat ?? "").trim() !== "" &&
    String(d.lng ?? "").trim() !== "" &&
    Number.isFinite(lat) &&
    Number.isFinite(lng)
  );
}

const inputClass =
  "w-full border border-ink/25 bg-cream px-3 py-2 text-sm text-ink focus:border-terracotta focus:outline-none";

export default function PlanEntryManager({
  scope,
  onDataChange,
  numberedPins,
  onPinClick,
}: {
  scope: string;
  onDataChange?: () => void;
  numberedPins: Map<string, number>;
  onPinClick?: (lat: number, lng: number) => void;
}) {
  const readOnly = useReadOnly();
  const { identity } = useIdentity();
  const toast = useToast();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [showLocation, setShowLocation] = useState(false);
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
      toast("Baza nie jest skonfigurowana.", "error");
      return;
    }
    // Async data fetch; setState happens after await, not synchronously.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refetch();
  }, [refetch, toast]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const sb = browserClient();
    const ch = sb
      .channel(`plan-entry:${scope}`)
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
    setForm({ time: "", text: "", lat: "", lng: "", place_type: "atrakcja" });
    setShowLocation(false);
    setEditingId(null);
    setAdding(true);
  };

  const startEdit = (entry: Entry) => {
    const d = entry.data;
    setForm({
      time: d.time != null ? String(d.time) : "",
      text: d.text != null ? String(d.text) : "",
      lat: d.lat != null ? String(d.lat) : "",
      lng: d.lng != null ? String(d.lng) : "",
      place_type: d.place_type != null ? String(d.place_type) : "atrakcja",
    });
    setShowLocation(hasCoords(d));
    setAdding(false);
    setEditingId(entry.id);
  };

  const cancel = () => {
    setAdding(false);
    setEditingId(null);
  };

  const buildData = (): Data => {
    const d: Data = { time: form.time ?? "", text: form.text ?? "" };
    const latRaw = String(form.lat ?? "").trim();
    const lngRaw = String(form.lng ?? "").trim();
    if (latRaw !== "" && lngRaw !== "") {
      d.lat = Number(latRaw.replace(",", "."));
      d.lng = Number(lngRaw.replace(",", "."));
      d.place_type = form.place_type || "atrakcja";
    }
    return d;
  };

  const save = async () => {
    if (!String(form.text ?? "").trim()) {
      toast("Uzupełnij: Co robimy?", "error");
      return;
    }
    setSaving(true);
    try {
      const by = identity?.name ?? null;
      if (editingId) await updateEntry(editingId, buildData(), by);
      else await addEntry(scope, buildData(), by);
      cancel();
      await refetch();
      onDataChange?.();
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
      onDataChange?.();
      toast("Usunięto.", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Błąd usuwania.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const renderForm = () => (
    <div className="postcard space-y-3 p-4">
      <label className="block text-sm">
        <span className="mb-1 block text-ink-soft">Godzina (opcjonalnie)</span>
        <input
          type="text"
          className={inputClass}
          value={form.time ?? ""}
          placeholder="12:00"
          onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-ink-soft">Co robimy?</span>
        <input
          type="text"
          className={inputClass}
          value={form.text ?? ""}
          placeholder="Co robimy?"
          onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))}
        />
      </label>

      <div className="border-t border-ink/15 pt-2">
        <button
          type="button"
          onClick={() => setShowLocation((v) => !v)}
          className="text-xs font-semibold uppercase tracking-wide text-ink-soft hover:text-terracotta"
        >
          📍 Lokalizacja (opcjonalnie) {showLocation ? "▲" : "▼"}
        </button>
        {showLocation && (
          <div className="mt-3 space-y-3">
            <label className="block text-sm">
              <span className="mb-1 block text-ink-soft">Szerokość (lat)</span>
              <input
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={form.lat ?? ""}
                placeholder="np. 41.8902 (skopiuj z Google Maps)"
                onChange={(e) => setForm((p) => ({ ...p, lat: e.target.value }))}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-ink-soft">Długość (lng)</span>
              <input
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={form.lng ?? ""}
                placeholder="np. 12.4922"
                onChange={(e) => setForm((p) => ({ ...p, lng: e.target.value }))}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block text-ink-soft">Rodzaj</span>
              <select
                className={inputClass}
                value={form.place_type ?? "atrakcja"}
                onChange={(e) => setForm((p) => ({ ...p, place_type: e.target.value }))}
              >
                {PLACE_TYPES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
      </div>

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

  const renderMeta = (d: Data) => {
    const text = String(d.text ?? "");
    const coords = hasCoords(d);
    const num = numberedPins.get(text.toLowerCase());
    return (
      <div className="flex min-w-0 items-center gap-2">
        {coords ? (
          num != null ? (
            <button
              type="button"
              onClick={() => onPinClick?.(Number(d.lat), Number(d.lng))}
              className="inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full text-[11px] font-bold text-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
              style={{ backgroundColor: "#bf5a34" }}
            >
              {num}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onPinClick?.(Number(d.lat), Number(d.lng))}
              className="inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full text-[11px] focus:outline-none focus-visible:ring-2 focus-visible:ring-wine"
              style={{ backgroundColor: "#8a2f33" }}
            >
              🏠
            </button>
          )
        ) : null}
        {d.time ? (
          <span className="shrink-0 font-medium text-ink">{String(d.time)}</span>
        ) : (
          <span className="shrink-0 text-[10px] uppercase tracking-wide text-ink-soft/50">bez godz.</span>
        )}
      </div>
    );
  };

  if (loading) return <SkeletonList />;

  return (
    <div className="space-y-3">
      {entries.length === 0 && !adding && (
        <p className="rounded-xl border border-dashed border-sand-dark bg-cream px-4 py-3 text-sm text-ink-soft">
          Brak punktów - dodaj pierwszy.
        </p>
      )}

      <div className="space-y-3">
        {entries.map((entry) =>
          editingId === entry.id ? (
            <div key={entry.id}>{renderForm()}</div>
          ) : (
            <div
              key={entry.id}
              className="rounded-xl border border-sand-dark bg-white/70 px-4 py-4"
            >
              <div className="flex items-start justify-between gap-3">
                {renderMeta(entry.data)}
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
              <p className="mt-2 text-sm leading-snug text-ink break-words">
                {String(entry.data.text ?? "")}
              </p>
              {entry.data._by ? (
                <span className="mt-1 block text-[11px] text-ink-soft/60">
                  ✎ {String(entry.data._by)}
                  {entry.data._at ? ` · ${fmtDate(String(entry.data._at))}` : ""}
                </span>
              ) : null}
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
          + Dodaj punkt
        </button>
      )}
    </div>
  );
}
