import { supabaseAdmin } from '../../infra/supabaseAdmin.js';

export async function getTeam() {
  const { data, error } = await supabaseAdmin
    .from('team')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data;
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
