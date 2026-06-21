import axiosClient from '../../../shared/lib/axiosClient';

/**
 * Gets the list of beneficiary stories
 * @returns {Promise<object[]>} Stories
 */
export async function getBeneficiaryStories() {
  const response = await axiosClient.get('/beneficiarios');
  return response.data.data;
}

/**
 * Creates a beneficiary story
 * @param {object} data
 * @returns {Promise<object>} Created story
 */
export async function createStory(data) {
  const response = await axiosClient.post('/beneficiarios', data);
  return response.data.data;
}

/**
 * Updates a beneficiary story
 * @param {string} id
 * @param {object} data
 * @returns {Promise<object>} Updated story
 */
export async function updateStory(id, data) {
  const response = await axiosClient.put(`/beneficiarios/${id}`, data);
  return response.data.data;
}

/**
 * Deletes a beneficiary story
 * @param {string} id
 */
export async function deleteStory(id) {
  const response = await axiosClient.delete(`/beneficiarios/${id}`);
  return response.data;
}

/**
 * Helper wrapper to save (create or update) a story
 * @param {object} data
 * @param {string} editingId
 */
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

/**
 * Deletes a beneficiary story
 * @param {string} id
 */
export async function deleteBeneficiary(id) {
  return deleteStory(id);
}
