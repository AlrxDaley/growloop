import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Photo {
  id: string;
  user_id: string;
  url?: string;
  title?: string;
  description?: string;
  client_id?: string;
  zone_id?: string;
  plant?: string;
  date_taken?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
  // Optional joined fields
  client?: { name?: string; address?: string };
  zone?: { name?: string };
}

export function usePhotos() {
  const { user } = useAuth();

  const { data: photos = [], isLoading, error } = useQuery<Photo[]>({
    queryKey: ['photos'],
    queryFn: async () => {
      if (!user) return [] as Photo[];

      // Attempt to load from a potential photos table with optional joins
      const { data, error } = await supabase
        .from('photos')
        .select(`
          *,
          client:clients(name, address),
          zone:zones(name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        // If table doesn't exist or another error occurs, return empty safely
        console.warn('usePhotos query error:', error.message);
        return [] as Photo[];
      }

      return (data as unknown as Photo[]) || [];
    },
    enabled: !!user,
  });

  return { photos, isLoading, error };
}
