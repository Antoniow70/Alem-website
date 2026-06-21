import axiosClient from '../../../shared/lib/axiosClient';

/**
 * Gets the donations list with filters
 * @param {object} filters
 * @returns {Promise<object>} Donations list and count
 */
export async function getDonations(filters = {}) {
  const response = await axiosClient.get('/doacoes', { params: filters });
  return response.data;
}

/**
 * Gets total donation amount raised in a period
 * @param {string} dateFrom
 * @param {string} dateTo
 * @returns {Promise<number>} Total amount
 */
export async function getDonationsTotalByPeriod(dateFrom, dateTo) {
  const response = await axiosClient.get('/doacoes/total', { params: { dateFrom, dateTo } });
  return response.data.total || 0;
}

/**
 * Deletes a donation record
 * @param {string} id
 */
export async function deleteDonation(id) {
  const response = await axiosClient.delete(`/doacoes/${id}`);
  return response.data;
}

/**
 * Updates a donation status
 * @param {string} id
 * @param {string} status
 */
export async function updateDonationStatus(id, status) {
  const response = await axiosClient.patch(`/doacoes/${id}/status`, { status });
  return response.data;
}

/**
 * Submits a new donation declaration
 * @param {object} data
 */
export async function submitDonation(data) {
  const response = await axiosClient.post('/doacoes', data);
  return response.data;
}
