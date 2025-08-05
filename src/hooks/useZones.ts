import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

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
  client?: { name: string };
  plants?: { id: string; name: string }[];
}

export function useZones() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

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
          plants:plants(id, name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const createZone = useMutation({
    mutationFn: async (newZone: Omit<Zone, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'client' | 'plants'>) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('zones')
        .insert([{ ...newZone, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
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
    mutationFn: async ({ id, ...updates }: Partial<Zone> & { id: string }) => {
      const { data, error } = await supabase
        .from('zones')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
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