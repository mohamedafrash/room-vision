import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section className="grid gap-6 pb-2 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-5">
        <p className="rv-kicker">Workspace</p>
        <h2 className="font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-[-0.05em] text-[var(--rv-text)] sm:text-6xl">
          Welcome back to your redesign studio.
        </h2>
        <p className="max-w-2xl text-base leading-8 text-[var(--rv-text-muted)]">
          Upload a room, select a direction, and compare results without leaving the
          same working canvas. The layout follows the Stitch workspace structure across
          desktop and mobile.
        </p>
      </div>
      <div className="glass-card rv-outline grid gap-4 p-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--rv-text-soft)]">
            Studio notes
          </p>
          <p className="mt-2 text-sm leading-7 text-[var(--rv-text-muted)]">
            Best results come from well-lit wide shots. Keep the prompt explicit on
            finishes, mood, and lighting so the render can stay grounded.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Latency', value: '~10s' },
            { label: 'History', value: 'Saved' },
            { label: 'Output', value: 'High-res' },
            { label: 'Mode', value: 'Prompt + presets' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-[22px] bg-[var(--rv-surface-low)] px-4 py-3"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--rv-text-soft)]">
                {stat.label}
              </p>
              <p className="text-lg font-semibold text-[var(--rv-text)]">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
