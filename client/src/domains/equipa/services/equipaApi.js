import axiosClient from '../../../shared/lib/axiosClient';

/**
 * Gets the list of team members
 * @returns {Promise<object[]>} Team members
 */
export async function getTeam() {
  const response = await axiosClient.get('/equipa');
  return response.data.data;
}

/**
 * Creates a team member record
 * @param {object} data
 * @returns {Promise<object>} Created member
 */
export async function createTeamMember(data) {
  const response = await axiosClient.post('/equipa', data);
  return response.data.data;
}

/**
 * Updates a team member record
 * @param {string} id
 * @param {object} data
 * @returns {Promise<object>} Updated member
 */
export async function updateTeamMember(id, data) {
  const response = await axiosClient.put(`/equipa/${id}`, data);
  return response.data.data;
}

/**
 * Deletes a team member record
 * @param {string} id
 */
export async function deleteTeamMember(id) {
  const response = await axiosClient.delete(`/equipa/${id}`);
  return response.data;
}

/**
 * Helper wrapper to add or update a team member
 * @param {object} memberData
 * @param {string} editingId
 */
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
