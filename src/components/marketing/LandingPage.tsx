"use client";

import Link from "next/link";
import { Button } from "@/components/Button";
import { RoomVisionLogo } from "@/components/brand/RoomVisionLogo";

const STITCH_HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCmvoaCws0RyHm055HoGBrI-M_bsjoALxuIfQMjzFiy7cqVa7rTN35cYpz5d1YX4hW0Wp0wN8_NZfexynQd8mmvDcjjVaPDkKqZuUuRCMSeJJaXy3TdGDgiVhTwLqeJ-InyR0f6YdUi_CjWix1lk9oGyep2TBEcEQqqbAd9wT6Tuwv-Vsl2-4ILk0oYmJVpEKm11QJuTmh-2t4lfloeeTGR-k1JvVZNZvQdu_hEWJYr0iTdtc0JS3gRTev8ckkWju2nl-328ZHwBOs";

const FEATURES = [
  {
    title: "Upload",
    description: "Start from an existing room photo. The workspace handles spatial geometry and composition.",
  },
  {
    title: "Direct",
    description: "Guide the redesign with curated styles or a bespoke prompt written in plain language.",
  },
  {
    title: "Render",
    description: "Receive photoreal concepts with strong lighting, material tone, and furniture continuity.",
  },
];

const PLANS = [
  {
    name: "Free",
    price: "$0",
    caption: "For casual explorers",
    features: ["10 generations / day", "Generation history", "Core room redesign"],
  },
  {
    name: "Pro",
    price: "$9",
    caption: "For active redesign work",
    features: ["100 generations / day", "Priority processing", "Higher fidelity exports"],
    featured: true,
  },
  {
    name: "Unlimited",
    price: "$29",
    caption: "For studios and agencies",
    features: ["Unlimited generations", "Fastest queue", "Commercial usage"],
  },
];

export function LandingPage() {
  return (
    <div className="app-shell">
      <div className="glow-orb orb-left" />
      <div className="glow-orb orb-right" />
      <div className="noise-layer" />

      <div className="app-container space-y-16 pb-20 pt-4 sm:space-y-24">
        <header className="rv-frame rv-outline sticky top-4 z-20 flex items-center justify-between gap-4 px-5 py-4">
          <RoomVisionLogo />
          <nav className="hidden items-center gap-8 text-sm font-medium text-[var(--rv-text-muted)] md:flex">
            <a href="#product" className="hover:text-[var(--rv-primary)]">
              Product
            </a>
            <a href="#workflow" className="hover:text-[var(--rv-primary)]">
              Workflow
            </a>
            <a href="#pricing" className="hover:text-[var(--rv-primary)]">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button>Start redesigning</Button>
            </Link>
          </div>
        </header>

        <section
          id="product"
          className="relative min-h-[780px] overflow-hidden lg:flex lg:items-center"
        >
          <div className="grid w-full items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="space-y-7">
              <p className="rv-kicker">AI-Powered Interior Design</p>
              <h1 className="rv-section-title max-w-[8ch]">
                Redesign your room with an architectural eye, not a template.
              </h1>
              <p className="max-w-xl text-xl leading-8 text-[var(--rv-text-muted)]">
                Room Vision turns a single room photo into design-grade concepts with
                clear mood direction, material control, and photoreal output. The
                interface is built to feel like a design instrument rather than a
                generic generator.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/signup">
                  <Button className="px-8 py-4 text-base">Get Started</Button>
                </Link>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-[var(--rv-primary)] transition hover:bg-[var(--rv-surface-high)]"
                >
                  <span className="material-symbols-outlined text-[22px]">play_circle</span>
                  Watch Demo
                </button>
              </div>
            </div>

            <div className="relative min-h-[520px]">
              <div className="absolute inset-0 overflow-hidden rounded-[28px] bg-[var(--rv-surface-highest)] shadow-[0_28px_56px_rgba(25,28,29,0.08)]">
                <div
                  className="h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${STITCH_HERO_IMAGE})` }}
                />
              </div>

              <div className="absolute bottom-6 left-6 right-6 rounded-[22px] border border-[rgba(191,200,204,0.15)] bg-[rgba(248,250,250,0.82)] p-4 backdrop-blur-xl shadow-[0_18px_40px_rgba(25,28,29,0.08)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--rv-primary)] text-white">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4l1.8 5.5H20l-5 3.6 1.9 5.6L12 15.3 7.1 18.7 9 13.1 4 9.5h6.2L12 4z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[var(--rv-text)]">
                      Style: Scandinavian Modern
                    </p>
                    <p className="text-[10px] text-[var(--rv-text-muted)]">
                      AI processing complete in 9.8 seconds
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute right-6 top-10 w-[190px] rounded-[22px] bg-[rgba(248,250,250,0.88)] p-5 backdrop-blur-xl shadow-[0_18px_40px_rgba(25,28,29,0.08)]">
                <p className="rv-kicker mb-3">Studio note</p>
                <p className="text-sm leading-7 text-[var(--rv-text-muted)]">
                  Wide, bright source images perform best. Keep prompts specific on
                  mood, finishes, and lighting direction.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="workflow" className="space-y-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <p className="rv-kicker">Workflow</p>
              <h2 className="font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-[-0.04em] text-[var(--rv-text)] sm:text-5xl">
                A three-step studio flow.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-[var(--rv-text-muted)]">
              The product follows the same sequence across desktop and mobile: establish the
              room, set the design direction, then generate and compare concepts.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {FEATURES.map((feature, index) => (
              <article key={feature.title} className="glass-card rv-outline flex min-h-[280px] flex-col justify-between p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--rv-primary-soft)] text-[var(--rv-primary)]">
                  <span className="font-[family-name:var(--font-display)] text-lg font-extrabold">
                    0{index + 1}
                  </span>
                </div>
                <div className="space-y-3">
                  <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--rv-text)]">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-7 text-[var(--rv-text-muted)]">
                    {feature.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="pricing" className="space-y-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <p className="rv-kicker">Pricing</p>
              <h2 className="font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-[-0.04em] text-[var(--rv-text)] sm:text-5xl">
                Transparent plans for every studio.
              </h2>
            </div>
            <Link href="/pricing" className="text-sm font-semibold text-[var(--rv-primary)]">
              View full pricing
            </Link>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {PLANS.map((plan) => (
              <article
                key={plan.name}
                className={`glass-card rv-outline flex flex-col gap-8 p-8 ${
                  plan.featured ? "relative bg-white shadow-[0_28px_60px_rgba(0,91,111,0.12)]" : ""
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-8 rounded-full bg-[var(--rv-primary)] px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                    Most Popular
                  </span>
                )}
                <div>
                  <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--rv-text)]">
                    {plan.name}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--rv-text-muted)]">{plan.caption}</p>
                </div>
                <div className="font-[family-name:var(--font-display)] text-5xl font-extrabold tracking-[-0.05em] text-[var(--rv-text)]">
                  {plan.price}
                  <span className="ml-1 text-base font-medium text-[var(--rv-text-soft)]">
                    /month
                  </span>
                </div>
                <ul className="space-y-3 text-sm text-[var(--rv-text-muted)]">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--rv-primary-soft)] text-[var(--rv-primary)]">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
