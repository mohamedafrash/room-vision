import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

interface ImageCompareProps {
  beforeImage: string;
  afterImage: string;
  className?: string;
}

export const ImageCompare: React.FC<ImageCompareProps> = ({
  beforeImage,
  afterImage,
  className = "",
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
    [isResizing],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      handleMove(e.clientX);
    },
    [handleMove],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (isResizing) {
        e.preventDefault(); // Prevent scroll while dragging
        handleMove(e.touches[0].clientX);
      }
    },
    [handleMove, isResizing],
  );

  useEffect(() => {
    const stopResize = () => setIsResizing(false);

    if (isResizing) {
      // Add listeners to window for better drag handling
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
    }

    window.addEventListener("mouseup", stopResize);
    window.addEventListener("touchend", stopResize);
    window.addEventListener("touchcancel", stopResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseup", stopResize);
      window.removeEventListener("touchend", stopResize);
      window.removeEventListener("touchcancel", stopResize);
    };
  }, [isResizing, handleMouseMove, handleTouchMove]);

  // Determine if images are base64 or URLs for optimization
  const isBase64 = (src: string) => src.startsWith("data:");

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full select-none overflow-hidden rounded-2xl sm:rounded-[32px] border border-white/10 bg-black/20 touch-none ${className}`}
      onMouseDown={() => setIsResizing(true)}
      onTouchStart={() => setIsResizing(true)}
      role="slider"
      aria-label="Image comparison slider"
      aria-valuenow={Math.round(sliderPosition)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          setSliderPosition((prev) => Math.max(0, prev - 5));
        } else if (e.key === "ArrowRight") {
          setSliderPosition((prev) => Math.min(100, prev + 5));
        }
      }}
    >
      <Image
        src={beforeImage}
        alt="Original room"
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 50vw"
        className="object-contain bg-black/30"
        draggable={false}
        unoptimized={isBase64(beforeImage)}
        priority
      />
      <div
        className="absolute inset-0 h-full w-full overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <Image
          src={afterImage}
          alt="Generated room"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 50vw"
          className="object-contain"
          draggable={false}
          unoptimized={isBase64(afterImage)}
          priority
        />
      </div>

      {/* Slider handle */}
      <div
        className="absolute top-0 bottom-0 z-10 flex w-0.5 sm:w-1 items-center justify-center bg-white/80 shadow-[0_0_20px_rgba(0,0,0,0.4)] cursor-ew-resize"
        style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
      >
        <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-white/40 bg-white/90 shadow-lg active:scale-110 transition-transform">
          <svg
            className="h-4 w-4 sm:h-5 sm:w-5 text-black"
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

      {/* Labels */}
      <div className="absolute left-2 sm:left-4 top-2 sm:top-4 rounded-full bg-black/50 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-white/90">
        Before
      </div>
      <div className="absolute right-2 sm:right-4 top-2 sm:top-4 rounded-full bg-white/80 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-black">
        After
      </div>

      {/* Mobile hint */}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-[10px] sm:text-xs text-white/60 opacity-0 animate-fade-in-delayed sm:hidden">
        Drag to compare
      </div>
    </div>
  );
};
