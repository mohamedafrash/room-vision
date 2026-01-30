import { NextResponse } from 'next/server';
import { generateText, gateway } from 'ai';

export const runtime = 'nodejs';

const DEFAULT_MODEL = 'google/gemini-2.5-flash-image';

const parseDataUrl = (dataUrl: string) => {
  const match = /^data:(.*?);base64,(.*)$/.exec(dataUrl);
  if (!match) {
    throw new Error('Invalid image data URL');
  }
  const [, mediaType, base64] = match;
  return {
    mediaType,
    buffer: Buffer.from(base64, 'base64'),
  };
};

export async function POST(request: Request) {
  try {
    const { image, prompt, model } = (await request.json()) as {
      image?: string;
      prompt?: string;
      model?: string;
    };

    if (!image || !prompt) {
      return NextResponse.json(
        { error: 'Image and prompt are required.' },
        { status: 400 }
      );
    }

    const { mediaType, buffer } = parseDataUrl(image);

    const editResult = await generateText({
      model: gateway(model || DEFAULT_MODEL),
      prompt: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You are a high-end interior designer. Edit the room photo with this request: ${prompt}. Preserve perspective, lighting, and realism.`,
            },
            {
              type: 'image',
              image: buffer,
              mediaType,
            },
          ],
        },
      ],
    });

    const imageFile = editResult.files.find((file) =>
      file.mediaType.startsWith('image/')
    );

    if (!imageFile?.base64) {
      return NextResponse.json(
        { error: 'No image returned by the model.' },
        { status: 500 }
      );
    }

    const dataUrl = imageFile.base64.startsWith('data:')
      ? imageFile.base64
      : `data:${imageFile.mediaType};base64,${imageFile.base64}`;

    return NextResponse.json({ image: dataUrl });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Generation failed.' },
      { status: 500 }
    );
  }
}
