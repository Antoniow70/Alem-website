import { supabase } from '../../../shared/lib/supabaseClient';

export async function getPillars() {
  const { data, error } = await supabase
    .from('pillars')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getActivities(pillarId) {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('pillar_id', pillarId)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getAllActivities() {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .order('name', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getProjects(filters = {}) {
  let query = supabase.from('projects').select('*, activities(name)');
  
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
  const { data, error } = await supabase
    .from('projects')
    .select('*, activities(name)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function createProject(data) {
  const { data: result, error } = await supabase
    .from('projects')
    .insert([data])
    .select();
  if (error) throw error;
  return result[0];
}

export async function updateProject(id, data) {
  const { data: result, error } = await supabase
    .from('projects')
    .update(data)
    .eq('id', id)
    .select();
  if (error) throw error;
  return result[0];
}

export async function saveProject(payload, editingId) {
  if (editingId) {
    return updateProject(editingId, payload);
  } else {
    return createProject(payload);
  }
}

export async function deleteProject(id) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function updateProjectStatus(id, newStatus) {
  const { error } = await supabase
    .from('projects')
    .update({ status: newStatus })
    .eq('id', id);
  if (error) throw error;
}

// File Upload helper
export async function uploadFileToStorage(file, folder = 'projects') {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('project-media')
    .upload(filePath, file);

  if (uploadError) {
    return { error: uploadError, filePath: null, publicUrl: null };
  }

  const { data: urlData } = supabase.storage
    .from('project-media')
    .getPublicUrl(filePath);

  return { error: null, filePath, publicUrl: urlData.publicUrl };
}
