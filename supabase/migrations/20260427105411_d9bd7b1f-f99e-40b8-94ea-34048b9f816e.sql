-- files table (metadata for uploaded files)
CREATE TABLE public.files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  case_id uuid,
  name text NOT NULL,
  mime_type text,
  size_bytes bigint,
  storage_path text NOT NULL,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner select files" ON public.files FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Owner insert files" ON public.files FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owner update files" ON public.files FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owner delete files" ON public.files FOR DELETE USING (auth.uid() = owner_id);

CREATE TRIGGER set_files_updated_at BEFORE UPDATE ON public.files
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- exports table (history of exports)
CREATE TABLE public.exports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  case_id uuid,
  entity text NOT NULL,
  entity_id uuid,
  format text NOT NULL,
  title text,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.exports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner select exports" ON public.exports FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Owner insert exports" ON public.exports FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owner delete exports" ON public.exports FOR DELETE USING (auth.uid() = owner_id);

-- Storage bucket for case files (private, per-user folders)
INSERT INTO storage.buckets (id, name, public) VALUES ('case-files', 'case-files', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users read own case files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'case-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users upload own case files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'case-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users update own case files"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'case-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users delete own case files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'case-files' AND auth.uid()::text = (storage.foldername(name))[1]);