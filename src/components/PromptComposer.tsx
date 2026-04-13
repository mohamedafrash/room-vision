"use client";

import React, { useRef } from "react";
import { Button } from "./Button";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Cmd/Ctrl + Enter
    if (
      (e.metaKey || e.ctrlKey) &&
      e.key === "Enter" &&
      !disabled &&
      prompt.trim()
    ) {
      e.preventDefault();
      onGenerate();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onPromptChange(suggestion);
    // Focus the textarea after selecting a suggestion
    textareaRef.current?.focus();
  };

  return (
    <section className="glass-card rv-outline space-y-3 p-4 sm:space-y-4 sm:p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--rv-text-soft)] sm:text-sm sm:tracking-[0.2em]">
          Direction
        </p>
        <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--rv-text)] sm:text-xl">
          Describe the transformation
        </h3>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(event) => onPromptChange(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Try: 'Switch to warm walnut floors, add linen curtains, soft morning light.'"
            rows={3}
            className="w-full resize-none rounded-2xl border border-[rgba(191,200,204,0.18)] bg-[var(--rv-white)] px-3 py-2.5 text-sm text-[var(--rv-text)] placeholder:text-[var(--rv-text-soft)] focus:border-[var(--rv-primary)] focus:outline-none focus:ring-4 focus:ring-[rgba(180,235,255,0.45)] sm:rounded-3xl sm:px-4 sm:py-3"
            disabled={disabled}
          />
          <span className="absolute bottom-2 right-3 text-[10px] text-[var(--rv-text-soft)]">
            {prompt.length}/500
          </span>
        </div>

        <div className="relative -mx-4 sm:mx-0 px-4 sm:px-0">
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap scrollbar-hide">
            {suggestions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleSuggestionClick(item)}
                disabled={disabled}
                className="flex-shrink-0 rounded-full bg-[var(--rv-surface-low)] px-3 py-1.5 text-[11px] font-medium text-[var(--rv-text-muted)] transition hover:bg-[var(--rv-surface-high)] hover:text-[var(--rv-primary)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <Button
          onClick={onGenerate}
          isLoading={isProcessing}
          disabled={disabled || !prompt.trim()}
          className="w-full sm:w-auto"
        >
          Generate variation
        </Button>
        <span className="hidden text-xs text-[var(--rv-text-soft)] sm:block">
          or press ⌘ + Enter
        </span>
      </div>
    </section>
  );
};
