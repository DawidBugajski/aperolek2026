// Okrągła „pieczątka paszportowa” - dekoracyjny element w stylu plakatu.

export default function StampBadge({
  top,
  big,
  bottom,
  className = "",
}: {
  top: string;
  big: string;
  bottom: string;
  className?: string;
}) {
  return (
    <div
      className={
        "stamp flex h-28 w-28 flex-col items-center justify-center rounded-full text-center " +
        className
      }
      aria-hidden
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">{top}</span>
      <span className="font-display text-2xl font-bold leading-none">{big}</span>
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">{bottom}</span>
    </div>
  );
}
