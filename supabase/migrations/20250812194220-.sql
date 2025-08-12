-- Ensure plantmaterial is publicly readable for selection UI
ALTER TABLE public.plantmaterial ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'plantmaterial' AND policyname = 'Anyone can view plant catalog'
  ) THEN
    CREATE POLICY "Anyone can view plant catalog"
    ON public.plantmaterial
    FOR SELECT
    USING (true);
  END IF;
END $$;