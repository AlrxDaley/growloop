-- Create join table linking zones to plantmaterial (supports multiple plants per zone)
CREATE TABLE IF NOT EXISTS public.zone_plantmaterial (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  zone_id UUID NOT NULL REFERENCES public.zones(id) ON DELETE CASCADE,
  plantmaterial_id BIGINT NOT NULL REFERENCES public.plantmaterial(id),
  quantity INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT zone_plantmaterial_unique UNIQUE (user_id, zone_id, plantmaterial_id)
);

-- Enable RLS
ALTER TABLE public.zone_plantmaterial ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own zone_plantmaterial"
ON public.zone_plantmaterial
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own zone_plantmaterial"
ON public.zone_plantmaterial
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own zone_plantmaterial"
ON public.zone_plantmaterial
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own zone_plantmaterial"
ON public.zone_plantmaterial
FOR DELETE
USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_zone_plantmaterial_zone_id ON public.zone_plantmaterial(zone_id);
CREATE INDEX IF NOT EXISTS idx_zone_plantmaterial_plantmaterial_id ON public.zone_plantmaterial(plantmaterial_id);

-- Timestamp trigger
CREATE TRIGGER update_zone_plantmaterial_updated_at
BEFORE UPDATE ON public.zone_plantmaterial
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();