import axiosClient from '../../../shared/lib/axiosClient';

/**
 * Gets the volunteers list with filters
 * @param {object} filters
 * @returns {Promise<object>} Volunteers and total count
 */
export async function getVolunteers(filters = {}) {
  const response = await axiosClient.get('/voluntarios', { params: filters });
  return response.data;
}

/**
 * Deletes a volunteer candidacy
 * @param {string} id
 */
export async function deleteVolunteer(id) {
  const response = await axiosClient.delete(`/voluntarios/${id}`);
  return response.data;
}

/**
 * Updates a volunteer candidacy status
 * @param {string} id
 * @param {string} status
 */
export async function updateVolunteerStatus(id, status) {
  const response = await axiosClient.patch(`/voluntarios/${id}/status`, { status });
  return response.data;
}

/**
 * Marks a volunteer candidacy as read
 * @param {string} id
 */
export async function markVolunteerRead(id) {
  const response = await axiosClient.patch(`/voluntarios/${id}/read`);
  return response.data;
}

/**
 * Updates volunteer read status
 * @param {string} id
 * @param {string} readStatus
 */
export async function updateVolunteerReadStatus(id, readStatus) {
  return markVolunteerRead(id);
}

/**
 * Bulk updates volunteer candidates' status
 * @param {string[]} ids
 * @param {string} newStatus
 */
export async function bulkUpdateVolunteerStatus(ids, newStatus) {
  const response = await axiosClient.post('/voluntarios/bulk-status', { ids, status: newStatus });
  return response.data;
}

/**
 * Submits a volunteer candidacy
 * @param {object} data
 */
export async function submitVolunteer(data) {
  const response = await axiosClient.post('/voluntarios', data);
  return response.data;
}
