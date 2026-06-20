import { supabase } from '../../../shared/lib/supabaseClient';

export async function getBeneficiaryStories() {
  const { data, error } = await supabase
    .from('beneficiary_stories')
    .select('*, projects(name)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createStory(data) {
  const { data: result, error } = await supabase
    .from('beneficiary_stories')
    .insert([data])
    .select();
  if (error) throw error;
  return result[0];
}

export async function updateStory(id, data) {
  const { data: result, error } = await supabase
    .from('beneficiary_stories')
    .update(data)
    .eq('id', id)
    .select();
  if (error) throw error;
  return result[0];
}

export async function saveBeneficiary(data, editingId) {
  const payload = {
    full_name: data.full_name,
    story: data.story,
    project_id: data.project_id || null,
    image_url: data.image_data || data.image_url || '',
  };
  if (editingId) {
    return updateStory(editingId, payload);
  } else {
    return createStory(payload);
  }
}

export async function deleteStory(id) {
  const { error } = await supabase
    .from('beneficiary_stories')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function deleteBeneficiary(id) {
  return deleteStory(id);
}
