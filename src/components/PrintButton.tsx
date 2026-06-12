"use client";

// Triggers the browser's print dialog (which can "save as PDF").
// Hidden in the printout itself via the `no-print` class.
export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print border-2 border-ink/40 bg-terracotta px-4 py-2 text-xs font-semibold uppercase tracking-wide text-cream hover:bg-terracotta-dark"
    >
      🖨️ Drukuj / zapisz PDF
    </button>
  );
}
