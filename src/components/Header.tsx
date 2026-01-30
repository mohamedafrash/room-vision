import React from 'react';
import { Button } from './Button';

interface HeaderProps {
  onToggleHistory: () => void;
  isHistoryVisible: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleHistory,
  isHistoryVisible,
}) => {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 py-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
          <svg
            className="h-5 w-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 11l8-7 8 7v9a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4H9v4a2 2 0 01-2 2H3a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
            RoomVision
          </p>
          <h1 className="text-lg font-semibold text-white">Interior AI Studio</h1>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" onClick={onToggleHistory}>
          {isHistoryVisible ? 'Hide archive' : 'Show archive'}
        </Button>
      </div>
    </header>
  );
};
