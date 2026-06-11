// Loading placeholders that match the parchment palette.
// Use SkeletonList for the "data is loading" state of editable lists.

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={"animate-pulse rounded-xl bg-sand-dark/30 " + className}
      aria-hidden
    />
  );
}

export function SkeletonList({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-2" role="status" aria-label="Wczytywanie…">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-[52px] border border-sand-dark/40" />
      ))}
      <span className="sr-only">Wczytywanie…</span>
    </div>
  );
}
