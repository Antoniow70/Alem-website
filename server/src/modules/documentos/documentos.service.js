import { supabaseAdmin } from '../../infra/supabaseAdmin.js';

export async function getDocuments() {
  const { data, error } = await supabaseAdmin
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createDocument(payload) {
  const { data, error } = await supabaseAdmin
    .from('documents')
    .insert([payload])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateDocument(id, payload) {
  const { data, error } = await supabaseAdmin
    .from('documents')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteDocument(id) {
  const { error } = await supabaseAdmin
    .from('documents')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}
