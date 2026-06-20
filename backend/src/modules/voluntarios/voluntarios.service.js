import { supabaseAdmin } from '../../infra/supabaseAdmin.js';

export async function getVolunteers(filters = {}) {
  let query = supabaseAdmin.from('volunteers').select('*, activities(name)', { count: 'exact' });
  
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
    const from = (parseInt(filters.page) - 1) * parseInt(filters.pageSize);
    const to = from + parseInt(filters.pageSize) - 1;
    query = query.range(from, to);
  }
  
  const { data, error, count } = await query;
  if (error) throw error;
  return { data, count };
}

export async function deleteVolunteer(id) {
  const { error } = await supabaseAdmin
    .from('volunteers')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}

export async function updateVolunteerStatus(id, status) {
  if (status === 'Recusado') {
    return deleteVolunteer(id);
  }
  const { data, error } = await supabaseAdmin
    .from('volunteers')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function markVolunteerRead(id) {
  const { data, error } = await supabaseAdmin
    .from('volunteers')
    .update({ read_status: 'Lido' })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function bulkUpdateVolunteerStatus(ids, newStatus) {
  if (newStatus === 'Recusado') {
    const { error } = await supabaseAdmin.from('volunteers').delete().in('id', ids);
    if (error) throw error;
    return { message: 'Candidaturas eliminadas com sucesso.' };
  }
  const { data, error } = await supabaseAdmin
    .from('volunteers')
    .update({ status: newStatus })
    .in('id', ids)
    .select();
  if (error) throw error;
  return data;
}

export async function submitVolunteer(payload) {
  const { data, error } = await supabaseAdmin
    .from('volunteers')
    .insert([{
      ...payload,
      status: 'Pendente',
      read_status: 'Nao Lido'
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function saveVolunteer(payload, editingId) {
  if (editingId) {
    const { data, error } = await supabaseAdmin
      .from('volunteers')
      .update(payload)
      .eq('id', editingId)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabaseAdmin
      .from('volunteers')
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}
