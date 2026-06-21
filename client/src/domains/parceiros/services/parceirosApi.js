import axiosClient from '../../../shared/lib/axiosClient';

/**
 * Gets the list of partners
 * @returns {Promise<object[]>} Partners
 */
export async function getPartners() {
  const response = await axiosClient.get('/parceiros');
  return response.data.data;
}

/**
 * Creates a partner record
 * @param {object} data
 * @returns {Promise<object>} Created partner
 */
export async function createPartner(data) {
  const response = await axiosClient.post('/parceiros', data);
  return response.data.data;
}

/**
 * Updates a partner record
 * @param {string} id
 * @param {object} data
 * @returns {Promise<object>} Updated partner
 */
export async function updatePartner(id, data) {
  const response = await axiosClient.put(`/parceiros/${id}`, data);
  return response.data.data;
}

/**
 * Deletes a partner record
 * @param {string} id
 */
export async function deletePartner(id) {
  const response = await axiosClient.delete(`/parceiros/${id}`);
  return response.data;
}

/**
 * Helper wrapper to add partner
 * @param {object} partnerData
 */
export async function addPartner(partnerData) {
  const payload = {
    name: partnerData.name,
    logo_url: partnerData.logo_data || partnerData.logo_url || ''
  };
  return createPartner(payload);
}
