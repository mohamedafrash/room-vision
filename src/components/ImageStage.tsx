import React, { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { ImageCompare } from "./ImageCompare";

interface ImageStageProps {
  currentImage: string | null;
  generatedResult: string | null;
  isProcessing: boolean;
  statusLabel: string;
  onFileSelect: (file: File) => void;
}

export const ImageStage: React.FC<ImageStageProps> = ({
  currentImage,
  generatedResult,
  isProcessing,
  statusLabel,
  onFileSelect,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      const file = fileList?.[0];
      if (file) {
        // Validate file type and size
        if (!file.type.startsWith("image/")) {
          alert("Please upload an image file");
          return;
        }
        if (file.size > 10 * 1024 * 1024) {
          alert("Image must be less than 10MB");
          return;
        }
        onFileSelect(file);
      }
    },
    [onFileSelect],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragActive(false);
      handleFiles(event.dataTransfer.files);
    },
    [handleFiles],
  );

  // Determine if image is base64 for optimization
  const isBase64 = (src: string) => src.startsWith("data:");

  const stageContent = useMemo(() => {
    if (!currentImage) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-4 px-4 text-center text-[var(--rv-text-muted)] sm:gap-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--rv-primary-soft)] sm:h-16 sm:w-16">
            <svg
              className="h-6 w-6 text-[var(--rv-primary)] sm:h-8 sm:w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[var(--rv-text)] sm:text-2xl">
              Drop a room photo
            </h2>
            <p className="max-w-sm text-xs sm:text-sm">
              Upload a clean shot of your interior to start crafting an inspired
              makeover.
            </p>
          </div>
          <label className="cursor-pointer active:scale-95 transition-transform">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => handleFiles(event.target.files)}
            />
            <span className="rounded-full bg-[var(--rv-surface-low)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--rv-primary)] transition hover:bg-[var(--rv-surface-high)] sm:px-5 sm:text-sm sm:tracking-[0.2em]">
              Select photo
            </span>
          </label>
        </div>
      );
    }

    if (generatedResult) {
      return (
        <ImageCompare beforeImage={currentImage} afterImage={generatedResult} />
      );
    }

    return (
      <div className="relative h-full w-full overflow-hidden rounded-2xl bg-[var(--rv-surface-low)] sm:rounded-[32px]">
        <Image
          src={currentImage}
          alt="Uploaded room"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 50vw"
          className="object-contain"
          unoptimized={isBase64(currentImage)}
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center bg-[rgba(25,28,29,0.08)] opacity-0 transition group-hover:opacity-100">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rv-text)]">
            Original
          </span>
        </div>
        {/* Re-upload button */}
        <label className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => handleFiles(event.target.files)}
          />
          <span className="flex items-center gap-2 rounded-full bg-white/88 px-3 py-1.5 text-xs font-medium text-[var(--rv-text)] shadow-[0_12px_28px_rgba(25,28,29,0.12)] transition hover:bg-white">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
              />
            </svg>
            Change
          </span>
        </label>
      </div>
    );
  }, [currentImage, generatedResult, handleFiles]);

  return (
    <section
      className={`glass-stage rv-outline group relative h-[320px] w-full overflow-hidden transition-all sm:h-[420px] lg:h-[520px] ${
        isDragActive ? "ring-2 ring-[var(--rv-primary)] scale-[1.01]" : ""
      }`}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragActive(true);
      }}
      onDragLeave={() => setIsDragActive(false)}
      onDrop={handleDrop}
    >
      {stageContent}

      {/* Processing overlay */}
      {isProcessing && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[rgba(248,250,250,0.84)] backdrop-blur-sm text-[var(--rv-primary)]">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--rv-primary)]/20 border-t-[var(--rv-primary)] sm:h-10 sm:w-10" />
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--rv-text-muted)] sm:text-sm sm:tracking-[0.25em]">
            {statusLabel}
          </p>
        </div>
      )}

      {/* Drag overlay */}
      {isDragActive && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[rgba(180,235,255,0.7)] backdrop-blur-sm">
          <div className="text-center space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-[var(--rv-primary)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-sm font-medium text-[var(--rv-text)]">
              Drop your image here
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
