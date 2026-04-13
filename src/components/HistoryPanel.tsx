import React from "react";
import Image from "next/image";
import type { GeneratedImage } from "../lib/types";

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
    <section className="glass-card rv-outline flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--rv-text-soft)]">
            Archive
          </p>
          <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--rv-text)]">
            Your latest scenes
          </h3>
        </div>
        {onClear && history.length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Clear your generation history from view?")) {
                onClear();
              }
            }}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rv-text-soft)] hover:text-[var(--rv-primary)]"
          >
            Clear
          </button>
        )}
      </div>
      {history.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[rgba(191,200,204,0.28)] bg-[var(--rv-surface-low)] px-4 py-6 text-center text-sm text-[var(--rv-text-muted)]">
          Start a render to build your before/after gallery.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {history.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              className={`group overflow-hidden rounded-[22px] bg-white text-left shadow-[0_18px_36px_rgba(25,28,29,0.05)] transition ${
                selectedId === item.id
                  ? "ring-2 ring-[var(--rv-primary)]"
                  : "hover:-translate-y-0.5"
              }`}
            >
              <div className="relative aspect-[4/3] bg-[var(--rv-surface-low)]">
                {item.generatedImageBase64 && (
                  <Image
                    src={item.generatedImageBase64}
                    alt={item.prompt}
                    fill
                    sizes="(max-width: 1024px) 50vw, 22vw"
                    className="object-cover transition duration-300 group-hover:scale-[1.03]"
                    unoptimized={item.generatedImageBase64.startsWith("data:")}
                  />
                )}
              </div>
              <div className="space-y-2 px-3 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--rv-text-soft)]">
                  {new Date(item.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="max-h-[2.6em] overflow-hidden text-sm text-[var(--rv-text-muted)]">
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
