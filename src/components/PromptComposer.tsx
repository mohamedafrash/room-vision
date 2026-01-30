import React from 'react';
import { Button } from './Button';

interface PromptComposerProps {
  prompt: string;
  disabled?: boolean;
  isProcessing?: boolean;
  onPromptChange: (value: string) => void;
  onGenerate: () => void;
  suggestions: string[];
}

export const PromptComposer: React.FC<PromptComposerProps> = ({
  prompt,
  disabled,
  isProcessing,
  onPromptChange,
  onGenerate,
  suggestions,
}) => {
  return (
    <section className="glass-card space-y-4 p-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
          Direction
        </p>
        <h3 className="text-xl font-semibold text-white">
          Describe the transformation
        </h3>
      </div>
      <div className="space-y-3">
        <textarea
          value={prompt}
          onChange={(event) => onPromptChange(event.target.value)}
          placeholder="Try: 'Switch to warm walnut floors, add linen curtains, soft morning light.'"
          rows={4}
          className="w-full rounded-3xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
          disabled={disabled}
        />
        <div className="flex flex-wrap gap-2">
          {suggestions.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onPromptChange(item)}
              className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-white/70 transition hover:border-white/40 hover:text-white"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={onGenerate}
          isLoading={isProcessing}
          disabled={disabled || !prompt.trim()}
        >
          Generate variation
        </Button>
      </div>
    </section>
  );
};
