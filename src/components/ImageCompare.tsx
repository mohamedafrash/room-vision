import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface ImageCompareProps {
  beforeImage: string;
  afterImage: string;
  className?: string;
}

export const ImageCompare: React.FC<ImageCompareProps> = ({
  beforeImage,
  afterImage,
  className = '',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!isResizing || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      setSliderPosition((x / rect.width) * 100);
    },
    [isResizing]
  );

  useEffect(() => {
    const stopResize = () => setIsResizing(false);
    window.addEventListener('mouseup', stopResize);
    window.addEventListener('touchend', stopResize);
    return () => {
      window.removeEventListener('mouseup', stopResize);
      window.removeEventListener('touchend', stopResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full select-none overflow-hidden rounded-[32px] border border-white/10 bg-black/20 ${className}`}
      onMouseMove={(e) => handleMove(e.clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onMouseDown={() => setIsResizing(true)}
      onTouchStart={() => setIsResizing(true)}
      role="presentation"
    >
      <Image
        src={beforeImage}
        alt="Original room"
        fill
        sizes="100vw"
        className="object-contain bg-black/30"
        draggable={false}
        unoptimized
      />
      <div
        className="absolute inset-0 h-full w-full overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <Image
          src={afterImage}
          alt="Generated room"
          fill
          sizes="100vw"
          className="object-contain"
          draggable={false}
          unoptimized
        />
      </div>

      <div
        className="absolute top-0 bottom-0 z-10 flex w-1 items-center justify-center bg-white/80 shadow-[0_0_20px_rgba(0,0,0,0.4)]"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/90 shadow-lg">
          <svg
            className="h-5 w-5 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 9l4-4 4 4m0 6l-4 4-4-4"
            />
          </svg>
        </div>
      </div>

      <div className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/90">
        Before
      </div>
      <div className="absolute right-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-black">
        After
      </div>
    </div>
  );
};
