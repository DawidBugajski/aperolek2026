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
        "stamp flex h-20 w-20 flex-col items-center justify-center rounded-full text-center sm:h-28 sm:w-28 " +
        className
      }
      aria-hidden
    >
      <span className="text-[8px] font-semibold uppercase tracking-[0.2em] sm:text-[10px]">{top}</span>
      <span className="font-display text-xl font-bold leading-none sm:text-2xl">{big}</span>
      <span className="text-[8px] font-semibold uppercase tracking-[0.2em] sm:text-[10px]">{bottom}</span>
    </div>
  );
}
