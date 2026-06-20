import { supabaseAdmin } from '../../infra/supabaseAdmin.js';

export async function getPillars() {
  const { data, error } = await supabaseAdmin
    .from('pillars')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getActivities(pillarId) {
  let query = supabaseAdmin.from('activities').select('*');
  if (pillarId) {
    query = query.eq('pillar_id', pillarId);
  }
  query = query.order('sort_order', { ascending: true });
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getAllActivities() {
  const { data, error } = await supabaseAdmin
    .from('activities')
    .select('*')
    .order('name', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getProjects(filters = {}) {
  let query = supabaseAdmin.from('projects').select('*, activities(name)');
  
  if (filters.activityId) {
    query = query.eq('activity_id', filters.activityId);
  }
  if (filters.status && filters.status !== 'Todos') {
    query = query.eq('status', filters.status);
  }
  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,objetivos_especificos.ilike.%${filters.search}%`);
  }
  
  query = query.order('created_at', { ascending: false });
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getProjectById(id) {
  const { data, error } = await supabaseAdmin
    .from('projects')
    .select('*, activities(name)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function createProject(payload) {
  const { data, error } = await supabaseAdmin
    .from('projects')
    .insert([payload])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProject(id, payload) {
  const { data, error } = await supabaseAdmin
    .from('projects')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProject(id) {
  const { error } = await supabaseAdmin
    .from('projects')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}

export async function updateProjectStatus(id, newStatus) {
  const { data, error } = await supabaseAdmin
    .from('projects')
    .update({ status: newStatus })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
