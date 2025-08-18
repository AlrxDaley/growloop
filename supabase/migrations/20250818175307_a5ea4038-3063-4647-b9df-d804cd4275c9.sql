-- Fix security issues from the linter

-- Update the function to have proper search_path
CREATE OR REPLACE FUNCTION update_zone_last_watered()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = 'public'
AS $$
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
$$;