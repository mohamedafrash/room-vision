import { GEMINI_MODEL_NAME } from './types';

interface GenerateResponse {
  image: string;
}

export const generateRoomVisualization = async (
  imageBase64: string,
  prompt: string
): Promise<string> => {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image: imageBase64,
      prompt,
      model: GEMINI_MODEL_NAME,
    }),
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}));
    const message =
      typeof errorPayload?.error === 'string'
        ? errorPayload.error
        : 'Generation failed. Please try again.';
    throw new Error(message);
  }

  const data = (await response.json()) as GenerateResponse;
  if (!data.image) {
    throw new Error('No image data returned.');
  }

  return data.image;
};
