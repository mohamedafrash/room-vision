export interface GeneratedImage {
  id: string;
  originalImageBase64: string;
  generatedImageBase64: string;
  prompt: string;
  timestamp: number;
}

export interface ProcessingState {
  isProcessing: boolean;
  stage: 'idle' | 'uploading' | 'generating' | 'finalizing';
  error: string | null;
}

export const GEMINI_MODEL_NAME = 'google/gemini-2.5-flash-image';
