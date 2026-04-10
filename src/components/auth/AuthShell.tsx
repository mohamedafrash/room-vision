import Link from "next/link";
import { ReactNode } from "react";
import { RoomVisionLogo } from "@/components/brand/RoomVisionLogo";

interface AuthShellProps {
  title: string;
  subtitle: string;
  eyebrow: string;
  children: ReactNode;
}

const MARKERS = [
  "Architectural-grade room redesign",
  "Generation history synced to your account",
  "Prompt-guided concepts with mobile support",
];

export function AuthShell({
  title,
  subtitle,
  eyebrow,
  children,
}: AuthShellProps) {
  return (
    <div className="app-shell min-h-screen">
      <div className="glow-orb orb-left" />
      <div className="glow-orb orb-right" />
      <div className="noise-layer" />

      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden w-[46%] flex-col justify-between px-10 py-10 lg:flex">
          <RoomVisionLogo />
          <div className="max-w-xl space-y-8">
            <p className="rv-kicker">{eyebrow}</p>
            <h1 className="font-[family-name:var(--font-display)] text-6xl font-extrabold leading-[0.92] tracking-[-0.05em] text-[var(--rv-text)]">
              {title}
            </h1>
            <p className="text-lg leading-8 text-[var(--rv-text-muted)]">{subtitle}</p>
          </div>
          <div className="space-y-4">
            {MARKERS.map((marker) => (
              <div
                key={marker}
                className="flex items-center gap-3 rounded-[20px] bg-white/70 px-5 py-4 shadow-[0_18px_40px_rgba(25,28,29,0.05)]"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--rv-primary-soft)] text-[var(--rv-primary)]">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-sm font-medium text-[var(--rv-text-muted)]">{marker}</span>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex flex-1 items-center justify-center px-6 py-8 sm:px-8 lg:px-14">
          <div className="w-full max-w-xl space-y-6">
            <div className="lg:hidden">
              <RoomVisionLogo />
            </div>
            <div className="glass-card rv-outline p-7 sm:p-10">
              {children}
            </div>
            <p className="text-center text-sm text-[var(--rv-text-soft)]">
              By continuing, you agree to use Room Vision for lawful interior design work.
              <Link href="/" className="ml-1 font-semibold text-[var(--rv-primary)]">
                Return home
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
