-- Create storage bucket for question images
INSERT INTO storage.buckets (id, name, public)
VALUES ('question-images', 'question-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow professors and admins to upload images
CREATE POLICY "Professors and admins can upload question images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'question-images'
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.role IN ('professor', 'admin')
  )
);

-- Allow all authenticated users to view question images
CREATE POLICY "Authenticated users can view question images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'question-images'
  AND auth.role() = 'authenticated'
);

-- Allow professors and admins to update/delete their own images
CREATE POLICY "Professors and admins can manage question images" ON storage.objects
FOR ALL USING (
  bucket_id = 'question-images'
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.role IN ('professor', 'admin')
  )
);