import { supabase } from '../../../shared/lib/supabaseClient';

export async function getTeam() {
  const { data, error } = await supabase
    .from('team')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data;
}

export async function createTeamMember(data) {
  const { data: result, error } = await supabase
    .from('team')
    .insert([data])
    .select();
  if (error) throw error;
  return result[0];
}

export async function updateTeamMember(id, data) {
  const { data: result, error } = await supabase
    .from('team')
    .update(data)
    .eq('id', id)
    .select();
  if (error) throw error;
  return result[0];
}

export async function deleteTeamMember(id) {
  const { error } = await supabase
    .from('team')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function addOrUpdateTeamMember(memberData, editingId) {
  const payload = {
    name: memberData.name,
    role: memberData.role,
    bio: memberData.bio || '',
    photo_url: memberData.photo_data || memberData.photo_url || '',
    sort_order: memberData.sort_order || 0
  };
  if (editingId) {
    return updateTeamMember(editingId, payload);
  } else {
    return createTeamMember(payload);
  }
}
