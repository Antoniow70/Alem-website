import { supabase } from '../../../shared/lib/supabaseClient';

export async function getMessages(filters = {}) {
  let query = supabase.from('messages').select('*', { count: 'exact' });
  
  if (filters.status && filters.status !== 'Todos') {
    query = query.eq('status', filters.status);
  }
  if (filters.read_status && filters.read_status !== 'Todos') {
    query = query.eq('read_status', filters.read_status);
  }
  if (filters.dateFrom) {
    query = query.gte('created_at', `${filters.dateFrom}T00:00:00`);
  }
  if (filters.dateTo) {
    query = query.lte('created_at', `${filters.dateTo}T23:59:59`);
  }
  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
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

export async function deleteMessage(id) {
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function updateMessageStatus(id, status) {
  if (status === 'Recusado') {
    return deleteMessage(id);
  }
  const { error } = await supabase
    .from('messages')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}

export async function markMessageRead(id) {
  const { error } = await supabase
    .from('messages')
    .update({ read_status: 'Lido' })
    .eq('id', id);
  if (error) throw error;
}

export async function updateMessageReadStatus(id, readStatus) {
  return markMessageRead(id);
}

export async function bulkUpdateMessageStatus(ids, newStatus) {
  if (newStatus === 'Recusado') {
    const { error } = await supabase.from('messages').delete().in('id', ids);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from('messages').update({ status: newStatus }).in('id', ids);
  if (error) throw error;
}

export async function submitMessage(data) {
  const { error } = await supabase
    .from('messages')
    .insert([{
      ...data,
      status: 'Pendente',
      read_status: 'Nao Lido'
    }]);
  if (error) throw error;
}
