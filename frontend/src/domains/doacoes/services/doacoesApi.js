import { supabase } from '../../../shared/lib/supabaseClient';

export async function getDonations(filters = {}) {
  let query = supabase.from('donations').select('*', { count: 'exact' });
  
  if (filters.status && filters.status !== 'Todos') {
    query = query.eq('status', filters.status);
  }
  if (filters.dateFrom) {
    query = query.gte('created_at', `${filters.dateFrom}T00:00:00`);
  }
  if (filters.dateTo) {
    query = query.lte('created_at', `${filters.dateTo}T23:59:59`);
  }
  
  query = query.order('created_at', { ascending: false });
  
  if (filters.page && filters.pageSize) {
    const from = (filters.page - 1) * filters.pageSize;
    const to = from + filters.pageSize - 1;
    query = query.range(from, to);
  }
  
  const { data, error, count } = await query;
  if (error) throw error;
  return { data, count };
}

export async function getDonationsTotalByPeriod(dateFrom, dateTo) {
  let query = supabase.from('donations').select('valor').eq('status', 'Recebido');
  if (dateFrom) {
    query = query.gte('created_at', `${dateFrom}T00:00:00`);
  }
  if (dateTo) {
    query = query.lte('created_at', `${dateTo}T23:59:59`);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).reduce((sum, d) => sum + (parseFloat(d.valor) || 0), 0);
}

export async function deleteDonation(id) {
  const { error } = await supabase
    .from('donations')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function updateDonationStatus(id, status) {
  if (status === 'Nao Recebido' || status === 'Recusado') {
    return deleteDonation(id);
  }
  const { error } = await supabase
    .from('donations')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}

export async function submitDonation(data) {
  const { error } = await supabase
    .from('donations')
    .insert([{
      ...data,
      status: 'Pendente'
    }]);
  if (error) throw error;
}
