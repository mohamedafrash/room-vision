import Link from "next/link";

interface RoomVisionLogoProps {
  href?: string;
  compact?: boolean;
  light?: boolean;
}

export function RoomVisionLogo({
  href = "/",
  compact = false,
  light = false,
}: RoomVisionLogoProps) {
  const textClass = light ? "text-white" : "text-[var(--rv-text)]";
  const subClass = light ? "text-white/70" : "text-[var(--rv-text-muted)]";

  return (
    <Link href={href} className="inline-flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--rv-primary)] to-[var(--rv-primary-strong)] text-white shadow-[0_14px_32px_rgba(0,91,111,0.22)]">
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      </span>
      {!compact && (
        <span className="flex flex-col">
          <span className={`font-[family-name:var(--font-display)] text-lg font-extrabold tracking-[-0.04em] ${textClass}`}>
            Room Vision
          </span>
          <span className={`text-[10px] font-semibold uppercase tracking-[0.28em] ${subClass}`}>
            AI Architect
          </span>
        </span>
      )}
    </Link>
  );
}
