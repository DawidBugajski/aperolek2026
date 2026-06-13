"use client";

export default function LogoBadge({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      width="68"
      height="68"
      aria-hidden
      className={className}
    >
      {/* Outer dashed stamp ring */}
      <circle cx="40" cy="40" r="37" fill="none" stroke="#8a2f33" strokeWidth="2.5" strokeDasharray="4 3" />
      {/* Inner thin ring */}
      <circle cx="40" cy="40" r="30" fill="none" stroke="#8a2f33" strokeWidth="0.9" opacity="0.5" />

      {/* Top arc — "APEROLEK" */}
      <path id="lb-top" d="M 12,40 A 28,28 0 0,1 68,40" fill="none" />
      {/* Bottom arc — "2026" */}
      <path id="lb-bot" d="M 14,40 A 26,26 0 0,0 66,40" fill="none" />

      <text fontFamily="Fraunces, Georgia, serif" fontSize="11" fontWeight="700" fill="#8a2f33" letterSpacing="1.5">
        <textPath href="#lb-top" startOffset="50%" textAnchor="middle">APEROLEK</textPath>
      </text>

      <text fontFamily="Fraunces, Georgia, serif" fontSize="10" fontWeight="600" fill="#8a2f33" letterSpacing="2">
        <textPath href="#lb-bot" startOffset="50%" textAnchor="middle">2026</textPath>
      </text>

      {/* Wine glass — bowl */}
      <path d="M 31,23 Q 28.5,32 34,37 L 46,37 Q 51.5,32 49,23 Z" fill="#8a2f33" />
      {/* Stem */}
      <rect x="38.8" y="37" width="2.5" height="11" fill="#8a2f33" />
      {/* Base */}
      <rect x="33" y="48" width="14" height="2.8" rx="1.4" fill="#8a2f33" />
      {/* Highlight */}
      <path d="M 34,25 Q 32,31 34,35" stroke="#f4ead3" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.55" />
      {/* Bubbles */}
      <circle cx="43" cy="29" r="1.5" fill="#f4ead3" opacity="0.35" />
      <circle cx="45" cy="33" r="1" fill="#f4ead3" opacity="0.25" />
    </svg>
  );
}
