-- =============================================================================
-- Migration 0003: Storage Buckets & Policies for Shenen Kolu
-- =============================================================================

-- Create storage buckets if they do not exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'news-images',
    'news-images',
    true,
    5242880, -- 5 MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
  ),
  (
    'gallery',
    'gallery',
    true,
    8388608, -- 8 MB
    ARRAY['image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'attachments',
    'attachments',
    true,
    10485760, -- 10 MB
    ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png']
  )
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- -----------------------------------------------------------------------------
-- Storage RLS Policies
-- -----------------------------------------------------------------------------

-- Public Read Policies
CREATE POLICY "Public Read for news-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'news-images');

CREATE POLICY "Public Read for gallery"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery');

CREATE POLICY "Public Read for public attachments"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'attachments');

-- Staff Upload Policies
CREATE POLICY "Staff can upload to news-images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'news-images' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'editor')
    )
  );

CREATE POLICY "Staff can upload to gallery"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'gallery' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'editor')
    )
  );

CREATE POLICY "Staff can upload to attachments"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'attachments' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'editor')
    )
  );

-- Staff Update and Delete
CREATE POLICY "Staff can update uploaded assets"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'editor')
    )
  );

CREATE POLICY "Staff can delete uploaded assets"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'editor')
    )
  );
