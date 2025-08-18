-- Add new zone fields for enhanced soil, area, and sun exposure tracking
-- Only add columns if they don't already exist (idempotent)

-- Add soil type fields
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'zones' AND column_name = 'soil_type_enum') THEN
    ALTER TABLE public.zones ADD COLUMN soil_type_enum TEXT CHECK (soil_type_enum IN ('Clay', 'Loam', 'Sand', 'Silt', 'Chalk', 'Peat', 'Other'));
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'zones' AND column_name = 'soil_type_other') THEN
    ALTER TABLE public.zones ADD COLUMN soil_type_other TEXT;
  END IF;
END $$;

-- Add area size fields
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'zones' AND column_name = 'area_size_value') THEN
    ALTER TABLE public.zones ADD COLUMN area_size_value DECIMAL CHECK (area_size_value > 0);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'zones' AND column_name = 'area_size_unit') THEN
    ALTER TABLE public.zones ADD COLUMN area_size_unit TEXT CHECK (area_size_unit IN ('m²', 'ft²', 'acre'));
  END IF;
END $$;

-- Add sun exposure fields
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'zones' AND column_name = 'sun_primary') THEN
    ALTER TABLE public.zones ADD COLUMN sun_primary TEXT CHECK (sun_primary IN ('Full sun (6+ h)', 'Partial sun (3–6 h)', 'Partial shade (3–6 h filtered)', 'Dappled shade', 'Full shade (<3 h)'));
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'zones' AND column_name = 'sun_modifiers') THEN
    ALTER TABLE public.zones ADD COLUMN sun_modifiers TEXT[] DEFAULT '{}';
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'zones' AND column_name = 'sun_hours_estimate') THEN
    ALTER TABLE public.zones ADD COLUMN sun_hours_estimate DECIMAL;
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'zones' AND column_name = 'sun_notes') THEN
    ALTER TABLE public.zones ADD COLUMN sun_notes TEXT;
  END IF;
END $$;

-- Add last watered tracking
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'zones' AND column_name = 'last_watered_at') THEN
    ALTER TABLE public.zones ADD COLUMN last_watered_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Add task type field if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'task_type') THEN
    ALTER TABLE public.tasks ADD COLUMN task_type TEXT DEFAULT 'general';
  END IF;
END $$;

-- Create function to update zone last_watered_at when watering task completes
CREATE OR REPLACE FUNCTION update_zone_last_watered()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update if this is a watering task being marked as completed
  IF NEW.task_type = 'watering' AND NEW.status = 'completed' AND (OLD.status != 'completed' OR OLD.completed_at IS NULL) THEN
    -- Set completed_at if not already set
    IF NEW.completed_at IS NULL THEN
      NEW.completed_at = now();
    END IF;
    
    -- Update the zone's last_watered_at
    UPDATE public.zones 
    SET last_watered_at = NEW.completed_at
    WHERE id = NEW.zone_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for watering task completion
DROP TRIGGER IF EXISTS trigger_update_zone_last_watered ON public.tasks;
CREATE TRIGGER trigger_update_zone_last_watered
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_zone_last_watered();