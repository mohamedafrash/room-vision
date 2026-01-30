import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
          Visualize faster
        </p>
        <h2 className="text-4xl font-semibold text-white sm:text-5xl">
          See your room evolve in minutes with a gentle, photoreal touch.
        </h2>
        <p className="max-w-2xl text-base text-white/70">
          Upload an interior photo, direct the mood, and generate polished design
          variations. Optimized for clarity, realism, and spatial accuracy.
        </p>
      </div>
      <div className="glass-card grid gap-4 p-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
            Studio notes
          </p>
          <p className="mt-2 text-sm text-white/70">
            Best results come from wide, well-lit shots. Keep prompts specific but
            flexible to iterate across any model.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Latency', value: '~10s' },
            { label: 'Edits', value: 'Unlimited' },
            { label: 'Output', value: '4K-ready' },
            { label: 'Style', value: 'Photoreal' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                {stat.label}
              </p>
              <p className="text-lg font-semibold text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
