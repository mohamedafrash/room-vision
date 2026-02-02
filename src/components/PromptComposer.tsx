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
    <section className="glass-card space-y-3 sm:space-y-4 p-4 sm:p-5">
      <div>
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/60">
          Direction
        </p>
        <h3 className="text-lg sm:text-xl font-semibold text-white">
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
            className="w-full rounded-2xl sm:rounded-3xl border border-white/10 bg-black/40 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
            disabled={disabled}
          />
          {/* Character count indicator */}
          <span className="absolute bottom-2 right-3 text-[10px] text-white/30">
            {prompt.length}/500
          </span>
        </div>

        {/* Suggestions - horizontal scroll on mobile */}
        <div className="relative -mx-4 sm:mx-0 px-4 sm:px-0">
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap scrollbar-hide">
            {suggestions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleSuggestionClick(item)}
                disabled={disabled}
                className="flex-shrink-0 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[11px] sm:text-xs font-medium text-white/70 transition hover:border-white/40 hover:text-white hover:bg-white/10 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
        <span className="hidden sm:block text-xs text-white/40">
          or press ⌘ + Enter
        </span>
      </div>
    </section>
  );
};
