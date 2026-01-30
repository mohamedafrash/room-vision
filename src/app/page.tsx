'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { HistoryPanel } from '../components/HistoryPanel';
import { ImageStage } from '../components/ImageStage';
import { PromptComposer } from '../components/PromptComposer';
import { generateRoomVisualization } from '../lib/aiGateway';
import type { GeneratedImage, ProcessingState } from '../lib/types';
import { downloadImage, fileToBase64 } from '../lib/image';

const HISTORY_KEY = 'roomvision.history.v1';
const PROMPT_SUGGESTIONS = [
  'Warm walnut floors + ivory boucle sofa',
  'Add soft linen curtains, neutral palette',
  'Japandi mood with oak + black accents',
  'Coastal light with pale blue walls',
];

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Something went wrong.';

export default function HomePage() {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState<GeneratedImage[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const cached = localStorage.getItem(HISTORY_KEY);
      return cached ? (JSON.parse(cached) as GeneratedImage[]) : [];
    } catch {
      return [];
    }
  });
  const [showHistory, setShowHistory] = useState(true);

  const [status, setStatus] = useState<ProcessingState>({
    isProcessing: false,
    stage: 'idle',
    error: null,
  });

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 12)));
    } catch {
      // ignore storage errors
    }
  }, [history]);

  const statusLabel = useMemo(() => {
    if (status.stage === 'uploading') return 'Uploading image';
    if (status.stage === 'generating') return 'Rendering concept';
    if (status.stage === 'finalizing') return 'Polishing output';
    return 'Processing';
  }, [status.stage]);

  const handleFileSelect = async (file: File) => {
    setStatus({ isProcessing: true, stage: 'uploading', error: null });
    try {
      const base64 = await fileToBase64(file);
      setCurrentImage(base64);
      setGeneratedResult(null);
      setStatus({ isProcessing: false, stage: 'idle', error: null });
    } catch (error: unknown) {
      setStatus({
        isProcessing: false,
        stage: 'idle',
        error: getErrorMessage(error) || 'Failed to read file.',
      });
    }
  };

  const handleGenerate = async () => {
    if (!currentImage || !prompt.trim()) return;
    setStatus({ isProcessing: true, stage: 'generating', error: null });

    try {
      const resultBase64 = await generateRoomVisualization(currentImage, prompt);
      const newEntry: GeneratedImage = {
        id: crypto.randomUUID(),
        originalImageBase64: currentImage,
        generatedImageBase64: resultBase64,
        prompt,
        timestamp: Date.now(),
      };
      setGeneratedResult(resultBase64);
      setHistory((prev) => [newEntry, ...prev]);
      setStatus({ isProcessing: false, stage: 'idle', error: null });
    } catch (error: unknown) {
      setStatus({
        isProcessing: false,
        stage: 'idle',
        error: getErrorMessage(error) || 'Generation failed. Please try again.',
      });
    }
  };

  const handleHistorySelect = (item: GeneratedImage) => {
    setCurrentImage(item.originalImageBase64);
    setGeneratedResult(item.generatedImageBase64);
    setPrompt(item.prompt);
  };

  const handleDownload = () => {
    if (generatedResult) {
      downloadImage(generatedResult, `room-vision-${Date.now()}.png`);
    }
  };

  const selectedId = history.find(
    (item) => item.generatedImageBase64 === generatedResult
  )?.id;

  return (
    <div className="app-shell">
      <div className="glow-orb orb-left" />
      <div className="glow-orb orb-right" />
      <div className="noise-layer" />

      <div className="app-container">
        <Header
          onToggleHistory={() => setShowHistory((prev) => !prev)}
          isHistoryVisible={showHistory}
        />

        <Hero />

        <main className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-6">
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
            <div className="space-y-6">
              <HistoryPanel
                history={history}
                onSelect={handleHistorySelect}
                selectedId={selectedId}
                onClear={() => setHistory([])}
              />
              <section className="glass-card space-y-3 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
                  Export
                </p>
                <p className="text-sm text-white/70">
                  Download your final image or iterate with a fresh prompt.
                </p>
                <div className="flex flex-wrap gap-3">
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
            </div>
          )}
        </main>
      </div>

      {status.error && <div className="toast">{status.error}</div>}
    </div>
  );
}
