import { NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { PLANS, PlanId } from "@/lib/stripe";

export const runtime = "nodejs";

const DEFAULT_MODEL = "gemini-3.1-flash-image-preview";

const parseDataUrl = (dataUrl: string) => {
  const match = /^data:(.*?);base64,(.*)$/.exec(dataUrl);
  if (!match) {
    throw new Error("Invalid image data URL");
  }
  const [, mediaType, base64] = match;
  return {
    mediaType,
    buffer: Buffer.from(base64, "base64"),
  };
};

export async function POST(request: Request) {
  try {
    // 1. Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch user subscription tier
    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("plan_id, status")
      .eq("user_id", user.id)
      .maybeSingle();

    if (subscriptionError) {
      console.error("Failed to load subscription:", subscriptionError);
    }

    const isActive =
      subscription?.status === "active" || subscription?.status === "trialing";
    const isValidPlanId = (value: unknown): value is PlanId =>
      typeof value === "string" && value in PLANS;
    const planId: PlanId =
      isActive && isValidPlanId(subscription?.plan_id)
        ? subscription.plan_id
        : "free";
    const plan = PLANS[planId] ?? PLANS.free;

    // 3. Check rate limit based on subscription tier
    const { success, remaining } = await checkRateLimit(user.id, plan.id);
    if (!success) {
      return NextResponse.json(
        {
          error: `Rate limit exceeded. ${plan.name} plan allows ${plan.generationsPerMonth} generations per month.`,
          planId,
          limit: plan.generationsPerMonth,
        },
        { status: 429 },
      );
    }

    const { image, prompt, model } = (await request.json()) as {
      image?: string;
      prompt?: string;
      model?: string;
    };

    if (!image || !prompt) {
      return NextResponse.json(
        { error: "Image and prompt are required." },
        { status: 400 },
      );
    }

    // 4. Validate prompt length and content
    const MAX_PROMPT_LENGTH = 500;
    if (prompt.length > MAX_PROMPT_LENGTH) {
      return NextResponse.json(
        { error: `Prompt must be under ${MAX_PROMPT_LENGTH} characters.` },
        { status: 400 },
      );
    }

    // Block potential prompt injection patterns
    const blockedPatterns = [
      "ignore previous",
      "disregard instructions",
      "forget your instructions",
      "new instructions",
    ];
    if (blockedPatterns.some((p) => prompt.toLowerCase().includes(p))) {
      return NextResponse.json(
        { error: "Invalid prompt content." },
        { status: 400 },
      );
    }

    // 5. Validate image size (10MB limit)
    const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
    const { mediaType: originalMediaType, buffer: originalBuffer } =
      parseDataUrl(image);

    if (originalBuffer.length > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: "Image must be under 10MB." },
        { status: 400 },
      );
    }

    // 6. Upload original image to Supabase Storage
    const originalFileName = `original-${user.id}-${Date.now()}.png`;

    const { data: originalUploadData, error: originalUploadError } =
      await supabase.storage
        .from("room-vision")
        .upload(originalFileName, originalBuffer, {
          contentType: originalMediaType,
          upsert: false,
        });

    if (originalUploadError) {
      console.error("Failed to upload original image:", originalUploadError);
      return NextResponse.json(
        { error: "Failed to upload original image." },
        { status: 500 },
      );
    }

    const mediaType = originalMediaType;
    const buffer = originalBuffer;

    const editResult = await generateText({
      model: google(model || DEFAULT_MODEL),
      prompt: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are a high-end interior designer. Edit the room photo with this request: ${prompt}. Preserve perspective, lighting, and realism.`,
            },
            {
              type: "image",
              image: buffer,
              mediaType,
            },
          ],
        },
      ],
    });

    const imageFile = editResult.files.find((file) =>
      file.mediaType.startsWith("image/"),
    );

    if (!imageFile?.base64) {
      return NextResponse.json(
        { error: "No image returned by the model." },
        { status: 500 },
      );
    }

    // 7. Upload generated image to Supabase Storage
    const generatedBuffer = Buffer.from(imageFile.base64, "base64");
    const generatedFileName = `generated-${user.id}-${Date.now()}.png`;

    const { data: generatedUploadData, error: generatedUploadError } =
      await supabase.storage
        .from("room-vision")
        .upload(generatedFileName, generatedBuffer, {
          contentType: imageFile.mediaType,
          upsert: false,
        });

    if (generatedUploadError) {
      console.error("Failed to upload generated image:", generatedUploadError);
      return NextResponse.json(
        { error: "Failed to upload generated image." },
        { status: 500 },
      );
    }

    // 8. Save metadata to database
    const { error: dbError } = await supabase.from("generations").insert({
      user_id: user.id,
      original_image_path: originalUploadData.path,
      generated_image_path: generatedUploadData.path,
      prompt,
    });

    if (dbError) {
      console.error("Failed to save generation metadata:", dbError);
    }

    const dataUrl = imageFile.base64.startsWith("data:")
      ? imageFile.base64
      : `data:${imageFile.mediaType};base64,${imageFile.base64}`;

    return NextResponse.json({
      image: dataUrl,
      remaining_generations: remaining,
    });
  } catch (error: unknown) {
    console.error("[/api/generate] Caught error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed." },
      { status: 500 },
    );
  }
}
