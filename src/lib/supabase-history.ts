import { createClient } from "./supabase/client";
import type { GeneratedImage } from "./types";

export async function fetchUserHistory(): Promise<GeneratedImage[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("generations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;

  return data.map((item) => ({
    id: item.id,
    originalImageBase64: "", // Will load from storage path
    generatedImageBase64: "", // Will load from storage path
    originalImagePath: item.original_image_path,
    generatedImagePath: item.generated_image_path,
    prompt: item.prompt,
    timestamp: new Date(item.created_at).getTime(),
  }));
}

export async function deleteGeneration(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("generations").delete().eq("id", id);

  if (error) throw error;
}

export async function getImageUrl(path: string): Promise<string> {
  const supabase = createClient();
  const { data } = supabase.storage.from("room-vision").getPublicUrl(path);
  return data.publicUrl;
}
