import { supabase } from '../../../shared/lib/supabaseClient';

export async function getVolunteers(filters = {}) {
  let query = supabase.from('volunteers').select('*, activities(name)', { count: 'exact' });
  
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
    query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
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

export async function deleteVolunteer(id) {
  const { error } = await supabase
    .from('volunteers')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function updateVolunteerStatus(id, status) {
  if (status === 'Recusado') {
    return deleteVolunteer(id);
  }
  const { error } = await supabase
    .from('volunteers')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}

export async function markVolunteerRead(id) {
  const { error } = await supabase
    .from('volunteers')
    .update({ read_status: 'Lido' })
    .eq('id', id);
  if (error) throw error;
}

export async function updateVolunteerReadStatus(id, readStatus) {
  return markVolunteerRead(id);
}

export async function bulkUpdateVolunteerStatus(ids, newStatus) {
  if (newStatus === 'Recusado') {
    const { error } = await supabase.from('volunteers').delete().in('id', ids);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from('volunteers').update({ status: newStatus }).in('id', ids);
  if (error) throw error;
}

export async function submitVolunteer(data) {
  const { error } = await supabase
    .from('volunteers')
    .insert([{
      ...data,
      status: 'Pendente',
      read_status: 'Nao Lido'
    }]);
  if (error) throw error;
}

export async function saveVolunteer(data, editingId) {
  if (editingId) {
    const { error } = await supabase.from('volunteers').update(data).eq('id', editingId);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('volunteers').insert([data]);
    if (error) throw error;
  }
}
