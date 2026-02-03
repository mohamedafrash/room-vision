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
        <div className="flex h-full flex-col items-center justify-center gap-4 sm:gap-6 text-center text-white/70 px-4">
          <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full border border-white/20 bg-white/5">
            <svg
              className="h-6 w-6 sm:h-8 sm:w-8"
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
            <h2 className="text-xl sm:text-2xl font-semibold text-white">
              Drop a room photo
            </h2>
            <p className="max-w-sm text-xs sm:text-sm text-white/60">
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
            <span className="rounded-full border border-white/30 px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white transition hover:border-white/60 hover:bg-white/5">
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
      <div className="relative h-full w-full overflow-hidden rounded-2xl sm:rounded-[32px] bg-black/20">
        <Image
          src={currentImage}
          alt="Uploaded room"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 50vw"
          className="object-contain"
          unoptimized={isBase64(currentImage)}
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition group-hover:opacity-100">
          <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-black">
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
          <span className="flex items-center gap-2 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-black/80">
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
      className={`glass-stage group relative h-[320px] sm:h-[420px] lg:h-[520px] w-full overflow-hidden transition-all ${
        isDragActive ? "ring-2 ring-[#F3B187] scale-[1.01]" : ""
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
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black/70 backdrop-blur-sm text-white">
          <span className="h-8 w-8 sm:h-10 sm:w-10 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          <p className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.25em] text-white/70">
            {statusLabel}
          </p>
        </div>
      )}

      {/* Drag overlay */}
      {isDragActive && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="text-center space-y-2">
            <svg
              className="h-12 w-12 mx-auto text-[#F3B187]"
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
            <p className="text-sm font-medium text-white">
              Drop your image here
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
