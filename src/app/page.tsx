"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../components/Button";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { HistoryPanel } from "../components/HistoryPanel";
import { ImageStage } from "../components/ImageStage";
import { PromptComposer } from "../components/PromptComposer";
import {
  ImageStageSkeleton,
  PromptSkeleton,
  HistorySkeleton,
} from "../components/Skeleton";
import { Toast, ToastType } from "../components/Toast";
import { UpgradePrompt } from "../components/UpgradePrompt";
import { LandingPage } from "@/components/marketing/LandingPage";
import { generateRoomVisualization } from "../lib/aiGateway";
import type { GeneratedImage, ProcessingState } from "../lib/types";
import { downloadImage, fileToBase64 } from "../lib/image";
import { createClient } from "../lib/supabase/client";
import { fetchUserHistory, getImageUrl } from "../lib/supabase-history";
import { PlanId } from "../lib/stripe";
import type { User } from "@supabase/supabase-js";

const PROMPT_SUGGESTIONS = [
  "Warm walnut floors + ivory boucle sofa",
  "Add soft linen curtains, neutral palette",
  "Japandi mood with oak + black accents",
  "Coastal light with pale blue walls",
];

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong.";

const isRateLimitError = (error: unknown, errorMessage: string) => {
  if (error && typeof error === "object") {
    const maybeError = error as { code?: unknown; isRateLimited?: unknown };
    if (maybeError.code === "RATE_LIMITED") return true;
    if (maybeError.isRateLimited === true) return true;
  }

  const normalized = errorMessage.toLowerCase();
  return (
    normalized.includes("rate limit") || normalized.includes("rate-limited")
  );
};

// Toast notification interface
interface ToastNotification {
  message: string;
  type: ToastType;
  id: string;
}

export default function HomePage() {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [showHistory, setShowHistory] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [remainingGenerations, setRemainingGenerations] = useState<
    number | null
  >(null);
  const [toast, setToast] = useState<ToastNotification | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [planId, setPlanId] = useState<PlanId>("free");
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  const [status, setStatus] = useState<ProcessingState>({
    isProcessing: false,
    stage: "idle",
    error: null,
  });

  // Show toast notification
  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = `toast-${Date.now()}`;
    setToast({ message, type, id });
  }, []);

  // Clear toast
  const clearToast = useCallback(() => {
    setToast(null);
  }, []);

  useEffect(() => {
    // Check auth status and load history
    const initAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        try {
          const userHistory = await fetchUserHistory();
          // Load images from storage paths
          const historyWithImages = await Promise.all(
            userHistory.map(async (item) => {
              if (item.originalImagePath && item.generatedImagePath) {
                item.originalImageBase64 = await getImageUrl(
                  item.originalImagePath,
                );
                item.generatedImageBase64 = await getImageUrl(
                  item.generatedImagePath,
                );
              }
              return item;
            }),
          );
          setHistory(historyWithImages);
        } catch (error) {
          console.error("Failed to load history:", error);
        }

        // Fetch user subscription
        try {
          const { data: subscription } = await supabase
            .from("subscriptions")
            .select("plan_id, status")
            .eq("user_id", user.id)
            .single();
          const isActive =
            subscription?.status === "active" ||
            subscription?.status === "trialing";
          if (isActive && subscription?.plan_id) {
            setPlanId(subscription.plan_id as PlanId);
          } else {
            setPlanId("free");
          }
        } catch (error) {
          console.error("Failed to load subscription:", error);
        }
      }

      setLoading(false);
    };

    initAuth();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const statusLabel = useMemo(() => {
    if (status.stage === "uploading") return "Uploading image";
    if (status.stage === "generating") {
      return retryCount > 0
        ? `Retrying (${retryCount}/2)...`
        : "Rendering concept";
    }
    if (status.stage === "finalizing") return "Polishing output";
    return "Processing";
  }, [status.stage, retryCount]);

  const handleFileSelect = async (file: File) => {
    setStatus({ isProcessing: true, stage: "uploading", error: null });
    try {
      const base64 = await fileToBase64(file);
      setCurrentImage(base64);
      setGeneratedResult(null);
      setStatus({ isProcessing: false, stage: "idle", error: null });
    } catch (error: unknown) {
      setStatus({
        isProcessing: false,
        stage: "idle",
        error: getErrorMessage(error) || "Failed to read file.",
      });
    }
  };

  const handleGenerate = async () => {
    if (!currentImage || !prompt.trim()) return;
    if (!user) {
      setStatus({
        isProcessing: false,
        stage: "idle",
        error: "Please sign in to generate images.",
      });
      return;
    }

    setStatus({ isProcessing: true, stage: "generating", error: null });
    setRetryCount(0);

    const attemptGeneration = async (attempt: number): Promise<void> => {
      try {
        const result = await generateRoomVisualization(currentImage, prompt);
        setGeneratedResult(result.image);
        setRemainingGenerations(result.remaining_generations ?? null);
        showToast("Room transformation complete!", "success");

        // Refresh history
        setHistoryLoading(true);
        try {
          const userHistory = await fetchUserHistory();
          const historyWithImages = await Promise.all(
            userHistory.map(async (item) => {
              if (item.originalImagePath && item.generatedImagePath) {
                try {
                  item.originalImageBase64 = await getImageUrl(
                    item.originalImagePath,
                  );
                  item.generatedImageBase64 = await getImageUrl(
                    item.generatedImagePath,
                  );
                } catch (urlError) {
                  console.warn(
                    "Could not load signed URL for history item:",
                    urlError,
                  );
                }
              }
              return item;
            }),
          );
          setHistory(historyWithImages);
        } catch (historyError) {
          console.error("Failed to refresh history:", historyError);
        } finally {
          setHistoryLoading(false);
        }

        setStatus({ isProcessing: false, stage: "idle", error: null });
      } catch (error: unknown) {
        const errorMessage = getErrorMessage(error);

        // Retry logic for transient errors (max 2 retries)
        if (
          attempt < 2 &&
          !errorMessage.includes("Rate limit") &&
          !errorMessage.includes("Unauthorized")
        ) {
          setRetryCount(attempt + 1);
          setStatus({ isProcessing: true, stage: "generating", error: null });
          showToast(`Retrying... (${attempt + 1}/2)`, "warning");
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * (attempt + 1)),
          );
          return attemptGeneration(attempt + 1);
        }

        setStatus({
          isProcessing: false,
          stage: "idle",
          error: errorMessage || "Generation failed. Please try again.",
        });
        showToast(errorMessage || "Generation failed", "error");

        // Show upgrade prompt if rate limited
        if (isRateLimitError(error, errorMessage)) {
          setShowUpgradePrompt(true);
        }
      }
    };

    await attemptGeneration(0);
  };

  const handleHistorySelect = (item: GeneratedImage) => {
    if (item.originalImageBase64 && item.generatedImageBase64) {
      setCurrentImage(item.originalImageBase64);
      setGeneratedResult(item.generatedImageBase64);
      setPrompt(item.prompt);
    }
  };

  const handleDownload = () => {
    if (generatedResult) {
      downloadImage(generatedResult, `room-vision-${Date.now()}.png`);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setHistory([]);
    setCurrentImage(null);
    setGeneratedResult(null);
  };

  const selectedId = history.find(
    (item) => item.generatedImageBase64 === generatedResult,
  )?.id;

  if (loading) {
    return (
      <div className="app-shell">
        <div className="glow-orb orb-left" />
        <div className="glow-orb orb-right" />
        <div className="noise-layer" />
        <div className="app-container">
          <div className="flex items-center justify-between py-4 sm:py-6">
            <div className="h-8 w-32 animate-pulse rounded-lg bg-[var(--rv-surface-high)]" />
            <div className="h-8 w-24 animate-pulse rounded-lg bg-[var(--rv-surface-high)]" />
          </div>
          <div className="h-16 sm:h-20 mb-6" />
          <main className="grid gap-4 sm:gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="space-y-4 sm:space-y-6">
              <ImageStageSkeleton />
              <PromptSkeleton />
            </div>
            <div className="hidden lg:block">
              <HistorySkeleton />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  return (
    <div className="app-shell">
      <div className="glow-orb orb-left" />
      <div className="glow-orb orb-right" />
      <div className="noise-layer" />

      <div className="app-container">
        <div className="py-4 sm:py-6">
          <Header
            onToggleHistory={() => setShowHistory((prev) => !prev)}
            isHistoryVisible={showHistory}
            planId={planId}
            onLogout={handleLogout}
          />
          {remainingGenerations !== null && (
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--rv-text-soft)]">
              {remainingGenerations} generations remaining today
            </p>
          )}
        </div>

        <Hero />

        {status.error && (
          <div className="mb-6 rounded-[24px] bg-[rgba(186,26,26,0.08)] px-5 py-4 text-sm text-[#93000a] shadow-[0_12px_24px_rgba(186,26,26,0.08)]">
            {status.error}
          </div>
        )}

        <ErrorBoundary>
          <main className="grid gap-4 sm:gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="space-y-4 sm:space-y-6">
              <ImageStage
                currentImage={currentImage}
                generatedResult={generatedResult}
                isProcessing={status.isProcessing}
                statusLabel={statusLabel}
                onFileSelect={handleFileSelect}
              />
              <PromptComposer
                prompt={prompt}
                disabled={!currentImage || status.isProcessing}
                isProcessing={status.isProcessing}
                onPromptChange={setPrompt}
                onGenerate={handleGenerate}
                suggestions={PROMPT_SUGGESTIONS}
              />
            </div>

            {showHistory && (
              <div className="space-y-4 sm:space-y-6">
                {historyLoading ? (
                  <HistorySkeleton />
                ) : (
                  <>
                    <HistoryPanel
                      history={history}
                      onSelect={handleHistorySelect}
                      selectedId={selectedId}
                      onClear={() => setHistory([])}
                    />
                    <section className="glass-card rv-outline space-y-3 p-4 sm:p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--rv-text-soft)] sm:text-sm sm:tracking-[0.2em]">
                        Export
                      </p>
                      <p className="text-xs text-[var(--rv-text-muted)] sm:text-sm">
                        Download your final image or iterate with a fresh
                        prompt.
                      </p>
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        <Button
                          variant="secondary"
                          onClick={() => setGeneratedResult(null)}
                          disabled={!currentImage}
                        >
                          Reset view
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={handleDownload}
                          disabled={!generatedResult}
                        >
                          Save render
                        </Button>
                      </div>
                    </section>
                  </>
                )}
              </div>
            )}
          </main>
        </ErrorBoundary>
      </div>

      {/* Toast notification */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={clearToast} />
      )}

      {/* Upgrade prompt modal */}
      {showUpgradePrompt && planId !== "unlimited" && (
        <UpgradePrompt
          currentPlanId={planId}
          onClose={() => setShowUpgradePrompt(false)}
        />
      )}
    </div>
  );
}
