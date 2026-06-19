import { supabase, resolveProjectMediaUrls, resolveMediaUrl } from '../lib/supabase';

/**
 * Fetch all admin data from Supabase in one call.
 * Extracted from Admin.jsx fetchData().
 */
export async function fetchAllAdminData() {
  const { data: projData, error: projError } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
  const { data: volData, error: volError } = await supabase.from('volunteers').select('*, activities(name)').order('created_at', { ascending: false });
  const { data: msgData, error: msgError } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
  const { data: benData, error: benError } = await supabase.from('beneficiary_stories').select('*').order('created_at', { ascending: false });
  const { data: teamData, error: teamError } = await supabase.from('team').select('*').order('created_at', { ascending: false });
  const { data: partnersData, error: partnersError } = await supabase.from('partners').select('*').order('created_at', { ascending: false });
  const { data: donationsData, error: donationsError } = await supabase.from('donations').select('*').order('created_at', { ascending: false });

  if (projError) throw projError;
  if (volError) throw volError;
  if (msgError) throw msgError;
  if (benError) throw benError;
  if (teamError) throw teamError;
  if (partnersError) throw partnersError;
  if (donationsError) throw donationsError;

  // Resolve idb:// URLs to blob:// URLs for display
  const resolvedProjects = await resolveProjectMediaUrls(projData || []);

  const resolvedStories = await Promise.all((benData || []).map(async (story) => ({
    ...story,
    _original_image_url: story.image_url,
    image_url: await resolveMediaUrl(story.image_url)
  })));

  return {
    projects: resolvedProjects,
    volunteers: volData || [],
    messages: msgData || [],
    beneficiaries: resolvedStories,
    team: teamData || [],
    partners: partnersData || [],
    donations: donationsData || [],
  };
}

// ─── Partners ──────────────────────────────────────────────────────────────────

export async function addPartner(partnerData) {
  const payload = {
    name: partnerData.name,
    logo_url: partnerData.logo_data || partnerData.logo_url || ''
  };
  const { error } = await supabase.from('partners').insert([payload]);
  if (error) throw error;
}

export async function deletePartner(id) {
  const { error } = await supabase.from('partners').delete().eq('id', id);
  if (error) throw error;
}

// ─── Team ──────────────────────────────────────────────────────────────────────

export async function addOrUpdateTeamMember(memberData, editingId) {
  const payload = {
    name: memberData.name,
    role: memberData.role,
    bio: memberData.bio || '',
    photo_url: memberData.photo_data || memberData.photo_url || ''
  };

  if (editingId) {
    const { error } = await supabase.from('team').update(payload).eq('id', editingId);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('team').insert([payload]);
    if (error) throw error;
  }
}

export async function deleteTeamMember(id) {
  const { error } = await supabase.from('team').delete().eq('id', id);
  if (error) throw error;
}

// ─── Projects ──────────────────────────────────────────────────────────────────

export async function saveProject(payload, editingId) {
  if (editingId) {
    const { error } = await supabase.from('projects').update(payload).eq('id', editingId);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('projects').insert([payload]);
    if (error) throw error;
  }
}

export async function deleteProject(id) {
  await supabase.from('projects').delete().eq('id', id);
}

export async function updateProjectStatus(id, newStatus) {
  const { error } = await supabase.from('projects').update({ status: newStatus }).eq('id', id);
  if (error) throw error;
}

// ─── Volunteers ────────────────────────────────────────────────────────────────

export async function saveVolunteer(data, editingId) {
  if (editingId) {
    const { error } = await supabase.from('volunteers').update(data).eq('id', editingId);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('volunteers').insert([data]);
    if (error) throw error;
  }
}

export async function deleteVolunteer(id) {
  await supabase.from('volunteers').delete().eq('id', id);
}

export async function updateVolunteerStatus(id, newStatus) {
  if (newStatus === 'Recusado') {
    const { error } = await supabase.from('volunteers').delete().eq('id', id);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from('volunteers').update({ status: newStatus }).eq('id', id);
  if (error) throw error;
}

export async function updateVolunteerReadStatus(id, newReadStatus) {
  const { error } = await supabase.from('volunteers').update({ read_status: newReadStatus }).eq('id', id);
  if (error) throw error;
}

export async function bulkUpdateVolunteerStatus(ids, newStatus) {
  for (const id of ids) {
    await supabase.from('volunteers').update({ status: newStatus }).eq('id', id);
  }
}

// ─── Messages ──────────────────────────────────────────────────────────────────

export async function deleteMessage(id) {
  const { error } = await supabase.from('messages').delete().eq('id', id);
  if (error) throw error;
}

export async function updateMessageStatus(id, status) {
  if (status === 'Recusado') {
    const { error } = await supabase.from('messages').delete().eq('id', id);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from('messages').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function updateMessageReadStatus(id, newReadStatus) {
  const { error } = await supabase.from('messages').update({ read_status: newReadStatus }).eq('id', id);
  if (error) throw error;
}

export async function bulkUpdateMessageStatus(ids, newStatus) {
  for (const id of ids) {
    await supabase.from('messages').update({ status: newStatus }).eq('id', id);
  }
}

// ─── Beneficiaries ─────────────────────────────────────────────────────────────

export async function saveBeneficiary(data, editingId) {
  const payload = {
    full_name: data.full_name,
    story: data.story,
    project_id: data.project_id,
    image_url: data.image_url || '',
    image_data: data.image_data || '',
  };

  if (editingId) {
    const { error } = await supabase.from('beneficiary_stories').update(payload).eq('id', editingId);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('beneficiary_stories').insert([payload]);
    if (error) throw error;
  }
}

export async function deleteBeneficiary(id) {
  await supabase.from('beneficiary_stories').delete().eq('id', id);
}

// ─── File Upload ───────────────────────────────────────────────────────────────

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

// ─── Donations ─────────────────────────────────────────────────────────────────

export async function updateDonationStatus(id, newStatus) {
  if (newStatus === 'Nao Recebido' || newStatus === 'Recusado') {
    const { error } = await supabase.from('donations').delete().eq('id', id);
    if (error) throw error;
    return;
  }
  const { error } = await supabase.from('donations').update({ status: newStatus }).eq('id', id);
  if (error) throw error;
}

export async function deleteDonation(id) {
  const { error } = await supabase.from('donations').delete().eq('id', id);
  if (error) throw error;
}
