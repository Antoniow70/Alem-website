import { supabaseAdmin } from '../../infra/supabaseAdmin.js';

export async function getTeam() {
  try {
    const { data, error } = await supabaseAdmin
      .from('team')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) {
      if (error.code === '42703') { // column does not exist
        const fallback = await supabaseAdmin
          .from('team')
          .select('*')
          .order('created_at', { ascending: true });
        if (fallback.error) throw fallback.error;
        return fallback.data;
      }
      throw error;
    }
    return data;
  } catch (err) {
    console.error('Error fetching team with order:', err);
    const { data, error } = await supabaseAdmin
      .from('team')
      .select('*');
    if (error) throw error;
    return data || [];
  }
}

export async function createTeamMember(payload) {
  const { data, error } = await supabaseAdmin
    .from('team')
    .insert([payload])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTeamMember(id, payload) {
  const { data, error } = await supabaseAdmin
    .from('team')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTeamMember(id) {
  const { error } = await supabaseAdmin
    .from('team')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}
