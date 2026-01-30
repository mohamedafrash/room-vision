import React from 'react';
import Image from 'next/image';
import type { GeneratedImage } from '../lib/types';

interface HistoryPanelProps {
  history: GeneratedImage[];
  selectedId?: string;
  onSelect: (item: GeneratedImage) => void;
  onClear?: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  selectedId,
  onSelect,
  onClear,
}) => {
  return (
    <section className="glass-card flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
            Archive
          </p>
          <h3 className="text-lg font-semibold text-white">Your latest scenes</h3>
        </div>
        {onClear && history.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>
      {history.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/20 px-4 py-6 text-center text-sm text-white/60">
          Start a render to build your before/after gallery.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {history.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              className={`group overflow-hidden rounded-2xl border text-left transition ${
                selectedId === item.id
                  ? 'border-[#F3B187] shadow-[0_0_0_1px_rgba(243,177,135,0.35)]'
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              <div className="relative aspect-[4/3] bg-black/30">
                <Image
                  src={item.generatedImageBase64}
                  alt={item.prompt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 22vw"
                  className="object-cover transition duration-300 group-hover:scale-[1.03]"
                  unoptimized
                />
              </div>
              <div className="space-y-2 px-3 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                  {new Date(item.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <p className="max-h-[2.6em] overflow-hidden text-sm text-white/80">
                  {item.prompt}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
};
