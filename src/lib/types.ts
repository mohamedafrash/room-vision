export interface GeneratedImage {
  id: string;
  originalImageBase64?: string;
  generatedImageBase64?: string;
  originalImagePath?: string;
  generatedImagePath?: string;
  prompt: string;
  timestamp: number;
}

export interface ProcessingState {
  isProcessing: boolean;
  stage: "idle" | "uploading" | "generating" | "finalizing";
  error: string | null;
}

export const GEMINI_MODEL_NAME = "gemini-3.1-flash-image-preview";
