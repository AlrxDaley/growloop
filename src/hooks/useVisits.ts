import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Visit {
  id: string;
  user_id: string;
  client_id?: string;
  zone_id?: string;
  scheduled_date?: string;
  priority?: 'low' | 'medium' | 'high';
  created_at?: string;
  client?: { name?: string; address?: string };
  zone?: { name?: string };
}

export function useVisits() {
  const { user } = useAuth();

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const { data: visitsToday = [], isLoading, error } = useQuery<Visit[]>({
    queryKey: ['visits', 'today'],
    queryFn: async () => {
      if (!user) return [] as Visit[];

      const { data, error } = await supabase
        .from('visits')
        .select(`
          *,
          client:clients(name, address),
          zone:zones(name)
        `)
        .eq('user_id', user.id)
        .gte('scheduled_date', start.toISOString())
        .lt('scheduled_date', end.toISOString())
        .order('scheduled_date', { ascending: true });

      if (error) {
        console.warn('useVisits query error:', error.message);
        return [] as Visit[];
      }

      return (data as unknown as Visit[]) || [];
    },
    enabled: !!user,
  });

  return { visitsToday, isLoading, error };
}
