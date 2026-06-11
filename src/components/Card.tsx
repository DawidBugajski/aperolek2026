// Prosty, reużywalny kontener-„karta”. Server component.

export default function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        "rounded-2xl border border-sand-dark bg-white/70 p-5 shadow-sm " + className
      }
    >
      {children}
    </div>
  );
}
