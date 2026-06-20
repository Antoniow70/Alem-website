import { supabaseAdmin } from '../../infra/supabaseAdmin.js';

export async function getPartners() {
  const { data, error } = await supabaseAdmin
    .from('partners')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createPartner(payload) {
  const { data, error } = await supabaseAdmin
    .from('partners')
    .insert([payload])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updatePartner(id, payload) {
  const { data, error } = await supabaseAdmin
    .from('partners')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePartner(id) {
  const { error } = await supabaseAdmin
    .from('partners')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}
