import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PlantMaterialItem {
  id: number;
  common_name: string | null;
  scientific_name: string | null;
  popularity_rank: number | null;
}

export function usePlantMaterial() {
  const { data, isLoading, error } = useQuery<PlantMaterialItem[]>({
    queryKey: ['plantmaterial'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plantmaterial')
        .select('id, common_name, scientific_name, popularity_rank')
        .order('popularity_rank', { ascending: true, nullsFirst: false })
        .order('common_name', { ascending: true });

      if (error) throw error;
      return (data as PlantMaterialItem[]) || [];
    },
  });

  return { plantmaterial: data ?? [], isLoading, error };
}
