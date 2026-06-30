import { supabaseAdmin } from '../../infra/supabaseAdmin.js';

export async function getNews() {
  const { data, error } = await supabaseAdmin
    .from('news')
    .select('*')
    .order('news_date', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getNewsById(id) {
  const { data, error } = await supabaseAdmin
    .from('news')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function createNews(payload) {
  const { data, error } = await supabaseAdmin
    .from('news')
    .insert([payload])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateNews(id, payload) {
  const { data, error } = await supabaseAdmin
    .from('news')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteNews(id) {
  const { error } = await supabaseAdmin
    .from('news')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}
