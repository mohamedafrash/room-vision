-- Create the room-vision storage bucket (if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'room-vision',
  'room-vision',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for room images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;

-- Storage policies for the room-images bucket
-- File naming pattern: original-{userId}-{timestamp}.png or generated-{userId}-{timestamp}.png

-- Allow authenticated users to upload images (files must contain their user ID)
CREATE POLICY "Users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'room-vision' AND
  name LIKE '%' || auth.uid()::text || '%'
);

-- Allow public read access (bucket is public for viewing generated images)
CREATE POLICY "Public read access for room images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'room-images');

-- Allow users to delete their own images (files containing their user ID)
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'room-vision' AND
  name LIKE '%' || auth.uid()::text || '%'
);
