import axiosClient from '../../../shared/lib/axiosClient';

/**
 * Gets the support messages list with filters
 * @param {object} filters
 * @returns {Promise<object>} Messages and total count
 */
export async function getMessages(filters = {}) {
  const response = await axiosClient.get('/suporte', { params: filters });
  return response.data;
}

/**
 * Deletes a support message
 * @param {string} id
 */
export async function deleteMessage(id) {
  const response = await axiosClient.delete(`/suporte/${id}`);
  return response.data;
}

/**
 * Updates a support message status
 * @param {string} id
 * @param {string} status
 */
export async function updateMessageStatus(id, status) {
  const response = await axiosClient.patch(`/suporte/${id}/status`, { status });
  return response.data;
}

/**
 * Marks a support message as read
 * @param {string} id
 */
export async function markMessageRead(id) {
  const response = await axiosClient.patch(`/suporte/${id}/read`);
  return response.data;
}

/**
 * Updates support message read status
 * @param {string} id
 * @param {string} readStatus
 */
export async function updateMessageReadStatus(id, readStatus) {
  return markMessageRead(id);
}

/**
 * Bulk updates support messages' status
 * @param {string[]} ids
 * @param {string} newStatus
 */
export async function bulkUpdateMessageStatus(ids, newStatus) {
  const response = await axiosClient.post('/suporte/bulk-status', { ids, status: newStatus });
  return response.data;
}

/**
 * Submits a support message request
 * @param {object} data
 */
export async function submitMessage(data) {
  const response = await axiosClient.post('/suporte', data);
  return response.data;
}
