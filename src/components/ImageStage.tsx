import React, { useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import { ImageCompare } from './ImageCompare';

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
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragActive(false);
      handleFiles(event.dataTransfer.files);
    },
    [handleFiles]
  );

  const stageContent = useMemo(() => {
    if (!currentImage) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-6 text-center text-white/70">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/5">
            <svg
              className="h-8 w-8"
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
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-white">Drop a room photo</h2>
            <p className="max-w-sm text-sm text-white/60">
              Upload a clean shot of your interior to start crafting an inspired
              makeover.
            </p>
          </div>
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => handleFiles(event.target.files)}
            />
            <span className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:border-white/60">
              Select photo
            </span>
          </label>
        </div>
      );
    }

    if (generatedResult) {
      return <ImageCompare beforeImage={currentImage} afterImage={generatedResult} />;
    }

    return (
      <div className="relative h-full w-full overflow-hidden rounded-[32px] bg-black/20">
        <Image
          src={currentImage}
          alt="Uploaded room"
          fill
          sizes="100vw"
          className="object-contain"
          unoptimized
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition group-hover:opacity-100">
          <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-black">
            Original
          </span>
        </div>
      </div>
    );
  }, [currentImage, generatedResult, handleFiles]);

  return (
    <section
      className={`glass-stage group relative h-[520px] w-full overflow-hidden ${
        isDragActive ? 'ring-2 ring-[#F3B187]' : ''
      }`}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragActive(true);
      }}
      onDragLeave={() => setIsDragActive(false)}
      onDrop={handleDrop}
    >
      {stageContent}
      {isProcessing && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black/70 text-white">
          <span className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          <p className="text-sm uppercase tracking-[0.25em] text-white/70">{statusLabel}</p>
        </div>
      )}
    </section>
  );
};
