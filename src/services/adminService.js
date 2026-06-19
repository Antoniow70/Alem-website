import { supabase } from '../lib/supabaseClient';
import { exportDonationsPDF as pdfExportHelper } from '../utils/pdfExport';

// ==========================================
// 2A. Autenticacao
// ==========================================

export async function loginAdmin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function logoutAdmin() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

// ==========================================
// 2B. Pilares e Atividades
// ==========================================

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

// ==========================================
// 2C. Projetos
// ==========================================

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

// ==========================================
// 2D. Voluntarios
// ==========================================

export async function getVolunteers(filters = {}) {
  let query = supabase.from('volunteers').select('*, activities(name)', { count: 'exact' });
  
  if (filters.status && filters.status !== 'Todos') {
    query = query.eq('status', filters.status);
  }
  if (filters.read_status && filters.read_status !== 'Todos') {
    query = query.eq('read_status', filters.read_status);
  }
  if (filters.dateFrom) {
    query = query.gte('created_at', `${filters.dateFrom}T00:00:00`);
  }
  if (filters.dateTo) {
    query = query.lte('created_at', `${filters.dateTo}T23:59:59`);
  }
  if (filters.search) {
    query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
  }
  
  query = query.order('created_at', { ascending: false });
  
  if (filters.page && filters.pageSize) {
    const from = (filters.page - 1) * filters.pageSize;
    const to = from + filters.pageSize - 1;
    query = query.range(from, to);
  }
  
  const { data, error, count } = await query;
  if (error) throw error;
  return { data, count };
}

export async function deleteVolunteer(id) {
  const { error } = await supabase
    .from('volunteers')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function updateVolunteerStatus(id, status) {
  if (status === 'Recusado') {
    return deleteVolunteer(id);
  }
  const { error } = await supabase
    .from('volunteers')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}

export async function markVolunteerRead(id) {
  const { error } = await supabase
    .from('volunteers')
    .update({ read_status: 'Lido' })
    .eq('id', id);
  if (error) throw error;
}

export async function updateVolunteerReadStatus(id, readStatus) {
  return markVolunteerRead(id);
}

export async function bulkUpdateVolunteerStatus(ids, newStatus) {
  if (newStatus === 'Recusado') {
    const { error } = await supabase.from('volunteers').delete().in('id', ids);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from('volunteers').update({ status: newStatus }).in('id', ids);
  if (error) throw error;
}

export async function submitVolunteer(data) {
  const { error } = await supabase
    .from('volunteers')
    .insert([{
      ...data,
      status: 'Pendente',
      read_status: 'Nao Lido'
    }]);
  if (error) throw error;
}

export async function saveVolunteer(data, editingId) {
  if (editingId) {
    const { error } = await supabase.from('volunteers').update(data).eq('id', editingId);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('volunteers').insert([data]);
    if (error) throw error;
  }
}

// ==========================================
// 2E. Pedidos de Apoio (Messages)
// ==========================================

export async function getMessages(filters = {}) {
  let query = supabase.from('messages').select('*', { count: 'exact' });
  
  if (filters.status && filters.status !== 'Todos') {
    query = query.eq('status', filters.status);
  }
  if (filters.read_status && filters.read_status !== 'Todos') {
    query = query.eq('read_status', filters.read_status);
  }
  if (filters.dateFrom) {
    query = query.gte('created_at', `${filters.dateFrom}T00:00:00`);
  }
  if (filters.dateTo) {
    query = query.lte('created_at', `${filters.dateTo}T23:59:59`);
  }
  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
  }
  
  query = query.order('created_at', { ascending: false });
  
  if (filters.page && filters.pageSize) {
    const from = (filters.page - 1) * filters.pageSize;
    const to = from + filters.pageSize - 1;
    query = query.range(from, to);
  }
  
  const { data, error, count } = await query;
  if (error) throw error;
  return { data, count };
}

export async function deleteMessage(id) {
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function updateMessageStatus(id, status) {
  if (status === 'Recusado') {
    return deleteMessage(id);
  }
  const { error } = await supabase
    .from('messages')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}

export async function markMessageRead(id) {
  const { error } = await supabase
    .from('messages')
    .update({ read_status: 'Lido' })
    .eq('id', id);
  if (error) throw error;
}

export async function updateMessageReadStatus(id, readStatus) {
  return markMessageRead(id);
}

export async function bulkUpdateMessageStatus(ids, newStatus) {
  if (newStatus === 'Recusado') {
    const { error } = await supabase.from('messages').delete().in('id', ids);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from('messages').update({ status: newStatus }).in('id', ids);
  if (error) throw error;
}

export async function submitMessage(data) {
  const { error } = await supabase
    .from('messages')
    .insert([{
      ...data,
      status: 'Pendente',
      read_status: 'Nao Lido'
    }]);
  if (error) throw error;
}

// ==========================================
// 2F. Doacoes
// ==========================================

export async function getDonations(filters = {}) {
  let query = supabase.from('donations').select('*', { count: 'exact' });
  
  if (filters.status && filters.status !== 'Todos') {
    query = query.eq('status', filters.status);
  }
  if (filters.dateFrom) {
    query = query.gte('created_at', `${filters.dateFrom}T00:00:00`);
  }
  if (filters.dateTo) {
    query = query.lte('created_at', `${filters.dateTo}T23:59:59`);
  }
  
  query = query.order('created_at', { ascending: false });
  
  if (filters.page && filters.pageSize) {
    const from = (filters.page - 1) * filters.pageSize;
    const to = from + filters.pageSize - 1;
    query = query.range(from, to);
  }
  
  const { data, error, count } = await query;
  if (error) throw error;
  return { data, count };
}

export async function getDonationsTotalByPeriod(dateFrom, dateTo) {
  let query = supabase.from('donations').select('valor').eq('status', 'Recebido');
  if (dateFrom) {
    query = query.gte('created_at', `${dateFrom}T00:00:00`);
  }
  if (dateTo) {
    query = query.lte('created_at', `${dateTo}T23:59:59`);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).reduce((sum, d) => sum + (parseFloat(d.valor) || 0), 0);
}

export async function deleteDonation(id) {
  const { error } = await supabase
    .from('donations')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function updateDonationStatus(id, status) {
  if (status === 'Nao Recebido' || status === 'Recusado') {
    return deleteDonation(id);
  }
  const { error } = await supabase
    .from('donations')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}

export async function submitDonation(data) {
  const { error } = await supabase
    .from('donations')
    .insert([{
      ...data,
      status: 'Pendente'
    }]);
  if (error) throw error;
}

// ==========================================
// 2G. Parceiros
// ==========================================

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

// ==========================================
// 2H. Equipa
// ==========================================

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

// ==========================================
// 2I. Historias de Beneficiarios
// ==========================================

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

export async function deleteStory(id) {
  const { error } = await supabase
    .from('beneficiary_stories')
    .delete()
    .eq('id', id);
  if (error) throw error;
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

export async function deleteBeneficiary(id) {
  return deleteStory(id);
}

// ==========================================
// 2J. Exportacao PDF de Doacoes (RF-09)
// ==========================================

export async function exportDonationsPDF(dateFrom, dateTo) {
  const { data } = await getDonations({ dateFrom, dateTo });
  pdfExportHelper(data || [], { filterStart: dateFrom, filterEnd: dateTo });
}

// ==========================================
// Global Aggregator for Admin panel
// ==========================================

export async function fetchAllAdminData() {
  const [
    { data: projects },
    { data: volunteers },
    { data: messages },
    { data: beneficiaries },
    { data: team },
    { data: partners },
    { data: donations }
  ] = await Promise.all([
    supabase.from('projects').select('*, activities(name)').order('created_at', { ascending: false }),
    supabase.from('volunteers').select('*, activities(name)').order('created_at', { ascending: false }),
    supabase.from('messages').select('*').order('created_at', { ascending: false }),
    supabase.from('beneficiary_stories').select('*, projects(name)').order('created_at', { ascending: false }),
    supabase.from('team').select('*').order('sort_order', { ascending: true }),
    supabase.from('partners').select('*').order('created_at', { ascending: false }),
    supabase.from('donations').select('*').order('created_at', { ascending: false })
  ]);
  
  return {
    projects: projects || [],
    volunteers: volunteers || [],
    messages: messages || [],
    beneficiaries: beneficiaries || [],
    team: team || [],
    partners: partners || [],
    donations: donations || []
  };
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
