import { supabaseAdmin } from '../../infra/supabaseAdmin.js';

export async function getPillars() {
  const { data, error } = await supabaseAdmin
    .from('pillars')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getActivities(params = {}) {
  const { pillarId, projectId } = params;
  let query;
  if (projectId) {
    query = supabaseAdmin.from('activities').select('*').eq('project_id', projectId);
  } else if (pillarId) {
    query = supabaseAdmin
      .from('activities')
      .select('*, projects!inner(pillar_id)')
      .eq('projects.pillar_id', pillarId);
  } else {
    query = supabaseAdmin.from('activities').select('*');
  }
  query = query.order('sort_order', { ascending: true });
  const { data, error } = await query;
  if (error) throw error;
  
  // Clean up joining data if present
  if (data) {
    data.forEach(item => {
      delete item.projects;
    });
  }
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
  let query;
  
  if (filters.activityId) {
    query = supabaseAdmin.from('projects').select('*, activities!inner(id, name)');
    query = query.eq('activities.id', filters.activityId);
  } else {
    query = supabaseAdmin.from('projects').select('*, activities(id, name)');
  }
  
  if (filters.pillarId) {
    query = query.eq('pillar_id', filters.pillarId);
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
    .select('*, activities(id, name)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function updateProjectActivities(projectId, activityIds = []) {
  // Clear project_id for activities that were previously associated with this project
  await supabaseAdmin
    .from('activities')
    .update({ project_id: null })
    .eq('project_id', projectId);

  // Set project_id for the newly selected activities
  if (activityIds && activityIds.length > 0) {
    const { error } = await supabaseAdmin
      .from('activities')
      .update({ project_id: projectId })
      .in('id', activityIds);
    if (error) throw error;
  }
}

export async function createProject(payload) {
  const { activities, ...projectData } = payload;
  const { data, error } = await supabaseAdmin
    .from('projects')
    .insert([projectData])
    .select()
    .single();
  if (error) throw error;
  
  if (activities) {
    await updateProjectActivities(data.id, activities);
  }
  
  return getProjectById(data.id);
}

export async function updateProject(id, payload) {
  const { activities, ...projectData } = payload;
  const { data, error } = await supabaseAdmin
    .from('projects')
    .update(projectData)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  
  if (activities !== undefined) {
    await updateProjectActivities(id, activities);
  }
  
  return getProjectById(id);
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
