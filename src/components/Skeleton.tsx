"use client";

interface SkeletonProps {
  className?: string;
  variant?: "rectangular" | "circular" | "text";
}

export function Skeleton({
  className = "",
  variant = "rectangular",
}: SkeletonProps) {
  const baseClasses = "animate-pulse bg-white/10";

  const variantClasses = {
    rectangular: "rounded-2xl",
    circular: "rounded-full",
    text: "rounded h-4",
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />
  );
}

export function ImageStageSkeleton() {
  return (
    <div className="glass-stage h-[320px] sm:h-[420px] lg:h-[520px] w-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Skeleton variant="circular" className="h-16 w-16" />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
  );
}

export function HistorySkeleton() {
  return (
    <div className="glass-card p-5 space-y-4">
      <Skeleton className="h-5 w-24" />
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="aspect-square" />
        ))}
      </div>
    </div>
  );
}

export function PromptSkeleton() {
  return (
    <div className="glass-card p-5 space-y-4">
      <Skeleton className="h-12 w-full rounded-xl" />
      <div className="flex gap-2 flex-wrap">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-8 w-32 rounded-full" />
        ))}
      </div>
    </div>
  );
}
