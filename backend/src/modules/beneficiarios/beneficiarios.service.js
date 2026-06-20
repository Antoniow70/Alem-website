import { supabaseAdmin } from '../../infra/supabaseAdmin.js';

export async function getStories() {
  const { data, error } = await supabaseAdmin
    .from('beneficiary_stories')
    .select('*, projects(name)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createStory(payload) {
  const { data, error } = await supabaseAdmin
    .from('beneficiary_stories')
    .insert([payload])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateStory(id, payload) {
  const { data, error } = await supabaseAdmin
    .from('beneficiary_stories')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteStory(id) {
  const { error } = await supabaseAdmin
    .from('beneficiary_stories')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}
