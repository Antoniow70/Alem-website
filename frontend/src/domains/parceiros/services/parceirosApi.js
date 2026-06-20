import { supabase } from '../../../shared/lib/supabaseClient';

export async function getPartners() {
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createPartner(data) {
  const { data: result, error } = await supabase
    .from('partners')
    .insert([data])
    .select();
  if (error) throw error;
  return result[0];
}

export async function updatePartner(id, data) {
  const { data: result, error } = await supabase
    .from('partners')
    .update(data)
    .eq('id', id)
    .select();
  if (error) throw error;
  return result[0];
}

export async function deletePartner(id) {
  const { error } = await supabase
    .from('partners')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function addPartner(partnerData) {
  const payload = {
    name: partnerData.name,
    logo_url: partnerData.logo_data || partnerData.logo_url || ''
  };
  return createPartner(payload);
}
