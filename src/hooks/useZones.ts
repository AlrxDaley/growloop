import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { usePlantMaterial } from '@/hooks/usePlantMaterial';

export interface Zone {
  id: string;
  user_id: string;
  client_id: string;
  name: string;
  size?: string;
  plant_count: number;
  soil_type?: string;
  sunlight?: string;
  watering_schedule?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // New enhanced fields
  soil_type_enum?: 'Clay' | 'Loam' | 'Sand' | 'Silt' | 'Chalk' | 'Peat' | 'Other';
  soil_type_other?: string;
  area_size_value?: number;
  area_size_unit?: 'm²' | 'ft²' | 'acre';
  sun_primary?: 'Full sun (6+ h)' | 'Partial sun (3–6 h)' | 'Partial shade (3–6 h filtered)' | 'Dappled shade' | 'Full shade (<3 h)';
  sun_modifiers?: string[];
  sun_hours_estimate?: number;
  sun_notes?: string;
  last_watered_at?: string;
  client?: { name: string };
  plants?: { id: string; name: string }[];
}

export function useZones() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { plantmaterial } = usePlantMaterial();

  const {
    data: zones = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['zones'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('zones')
        .select(`
          *,
          client:clients(name),
          zone_plantmaterial:zone_plantmaterial(
            plantmaterial:plantmaterial(*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Map joined plantmaterial into legacy `plants` shape used by UI
      const mapped = (data as any[]).map((z: any) => ({
        ...z,
        plants: (z.zone_plantmaterial || []).map((zp: any) => ({
          id: String(zp?.plantmaterial?.id ?? ''),
          name: zp?.plantmaterial?.common_name || zp?.plantmaterial?.scientific_name || 'Unknown'
        }))
      }));
      return mapped as any;
    },
    enabled: !!user,
  });

  const createZone = useMutation({
    mutationFn: async (newZone: Omit<Zone, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'client' | 'plants'> & { selected_plants?: string[] }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { selected_plants, ...zoneData } = newZone;
      
      const { data, error } = await supabase
        .from('zones')
        .insert([{ ...zoneData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      // If plants were selected, add them to the zone_plantmaterial table
      if (selected_plants && selected_plants.length > 0) {
        const plantInserts = selected_plants.map(plantName => {
          // Find the plant material by name
          const plantMaterial = plantmaterial.find(pm => 
            pm.common_name === plantName || pm.scientific_name === plantName
          );
          
          if (plantMaterial) {
            return {
              zone_id: data.id,
              plantmaterial_id: plantMaterial.id,
              user_id: user.id
            };
          }
          return null;
        }).filter(Boolean);

        if (plantInserts.length > 0) {
          const { error: plantError } = await supabase
            .from('zone_plantmaterial')
            .insert(plantInserts);
          
          if (plantError) throw plantError;
        }
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zones'] });
      toast({
        title: "Success",
        description: "Zone created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create zone",
        variant: "destructive",
      });
    },
  });

  const updateZone = useMutation({
    mutationFn: async ({ id, selected_plants, ...updates }: Partial<Zone> & { id: string; selected_plants?: string[] }) => {
      // Update the zone data
      const { data, error } = await supabase
        .from('zones')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Handle plant updates if provided
      if (selected_plants !== undefined) {
        // First, remove existing plant associations
        const { error: deleteError } = await supabase
          .from('zone_plantmaterial')
          .delete()
          .eq('zone_id', id);
        
        if (deleteError) throw deleteError;
        
        // Then add new plant associations
        if (selected_plants.length > 0) {
          const plantInserts = selected_plants.map(plantName => {
            // Find the plant material by name
            const plantMaterial = plantmaterial.find(pm => 
              pm.common_name === plantName || pm.scientific_name === plantName
            );
            
            if (plantMaterial) {
              return {
                zone_id: id,
                plantmaterial_id: plantMaterial.id,
                user_id: user?.id
              };
            }
            return null;
          }).filter(Boolean);

          if (plantInserts.length > 0) {
            const { error: plantError } = await supabase
              .from('zone_plantmaterial')
              .insert(plantInserts);
            
            if (plantError) throw plantError;
          }
        }
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zones'] });
      toast({
        title: "Success",
        description: "Zone updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update zone",
        variant: "destructive",
      });
    },
  });

  const deleteZone = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('zones')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zones'] });
      toast({
        title: "Success",
        description: "Zone deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete zone",
        variant: "destructive",
      });
    },
  });

  return {
    zones,
    isLoading,
    error,
    createZone,
    updateZone,
    deleteZone,
  };
}