import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface Client {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  address: string;
  status: 'active' | 'inactive' | 'pending';
  notes?: string;
  created_at: string;
  updated_at: string;
  zones?: { id: string; name: string }[];
  last_visit?: string;
}

export function useClients() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: clients = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('clients')
        .select(`
          *,
          zones:zones(id, name),
          visits:visits(scheduled_date)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map((client: any) => ({
        ...client,
        zones: client.zones || [],
        last_visit: client.visits?.[0]?.scheduled_date || null,
      }));
    },
    enabled: !!user,
  });

  const createClient = useMutation({
    mutationFn: async (newClient: Omit<Client, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated');

      const name = (newClient as any).name?.trim() || '';
      const address = (newClient as any).address?.trim() || '';
      const email = (newClient as any).email?.trim() || '';
      const phone = (newClient as any).phone?.trim() || '';

      // 1) Duplicate by Name + Address (case-insensitive)
      if (name && address) {
        const { data: nameAddrDup, error: nameAddrErr } = await supabase
          .from('clients')
          .select('id')
          .eq('user_id', user.id)
          .ilike('name', name)
          .ilike('address', address)
          .limit(1);
        if (nameAddrErr) throw nameAddrErr;
        if (nameAddrDup && nameAddrDup.length > 0) {
          throw new Error('A client with the same name and address already exists.');
        }
      }

      // 2) Duplicate by Email or Phone (case-insensitive)
      if (email || phone) {
        let query = supabase
          .from('clients')
          .select('id')
          .eq('user_id', user.id);
        const orParts: string[] = [];
        if (email) orParts.push(`email.ilike.${email}`);
        if (phone) orParts.push(`phone.ilike.${phone}`);
        if (orParts.length) {
          const { data: contactDup, error: contactErr } = await query.or(orParts.join(','))
            .limit(1);
          if (contactErr) throw contactErr;
          if (contactDup && contactDup.length > 0) {
            throw new Error('A client with the same email or phone already exists.');
          }
        }
      }

      const { data, error } = await supabase
        .from('clients')
        .insert([{ ...newClient, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Success",
        description: "Client created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create client",
        variant: "destructive",
      });
    },
  });

  const updateClient = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Client> & { id: string }) => {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Success",
        description: "Client updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update client",
        variant: "destructive",
      });
    },
  });

  const deleteClient = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Success",
        description: "Client deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete client",
        variant: "destructive",
      });
    },
  });

  return {
    clients,
    isLoading,
    error,
    createClient,
    updateClient,
    deleteClient,
  };
}