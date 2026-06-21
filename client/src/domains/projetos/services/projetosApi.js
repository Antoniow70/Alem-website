import axiosClient from '../../../shared/lib/axiosClient';

/**
 * Gets all pillars from backend
 * @returns {Promise<object[]>} Pillars
 */
export async function getPillars() {
  const response = await axiosClient.get('/projetos/pillars');
  return response.data.data;
}

/**
 * Gets activities for a specific pillar or all if pillarId is null
 * @param {string} pillarId
 * @returns {Promise<object[]>} Activities
 */
export async function getActivities(pillarId) {
  const response = await axiosClient.get('/projetos/activities', { params: { pillarId } });
  return response.data.data;
}

/**
 * Gets all activities sorted by name
 * @returns {Promise<object[]>} Activities
 */
export async function getAllActivities() {
  const response = await axiosClient.get('/projetos/activities/all');
  return response.data.data;
}

/**
 * Gets projects matching filters
 * @param {object} filters
 * @returns {Promise<object[]>} Projects
 */
export async function getProjects(filters = {}) {
  const response = await axiosClient.get('/projetos', { params: filters });
  return response.data.data;
}

/**
 * Gets a single project by its ID
 * @param {string} id
 * @returns {Promise<object>} Project data
 */
export async function getProjectById(id) {
  const response = await axiosClient.get(`/projetos/${id}`);
  return response.data.data;
}

/**
 * Creates a new project
 * @param {object} data
 * @returns {Promise<object>} Created project
 */
export async function createProject(data) {
  const response = await axiosClient.post('/projetos', data);
  return response.data.data;
}

/**
 * Updates an existing project
 * @param {string} id
 * @param {object} data
 * @returns {Promise<object>} Updated project
 */
export async function updateProject(id, data) {
  const response = await axiosClient.put(`/projetos/${id}`, data);
  return response.data.data;
}

/**
 * Wrapper for creating/updating a project
 * @param {object} payload
 * @param {string} editingId
 */
export async function saveProject(payload, editingId) {
  if (editingId) {
    return updateProject(editingId, payload);
  } else {
    return createProject(payload);
  }
}

/**
 * Deletes a project
 * @param {string} id
 */
export async function deleteProject(id) {
  const response = await axiosClient.delete(`/projetos/${id}`);
  return response.data;
}

/**
 * Updates project lifecycle status
 * @param {string} id
 * @param {string} newStatus
 */
export async function updateProjectStatus(id, newStatus) {
  const response = await axiosClient.patch(`/projetos/${id}/status`, { status: newStatus });
  return response.data.data;
}

/**
 * Helper to upload files to backend media storage (converting to base64 on client-side)
 * @param {File} file
 * @param {string} folder
 * @returns {Promise<object>} Result containing error and publicUrl
 */
export async function uploadFileToStorage(file, folder = 'projects') {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const fileData = reader.result;
        const response = await axiosClient.post('/upload', {
          fileData,
          fileName: file.name,
          folder
        });
        resolve({ error: null, filePath: null, publicUrl: response.data.publicUrl });
      } catch (err) {
        console.error('File upload failed via backend:', err);
        resolve({ error: err, filePath: null, publicUrl: null });
      }
    };
    reader.onerror = (error) => {
      console.error('File read error:', error);
      resolve({ error, filePath: null, publicUrl: null });
    };
    reader.readAsDataURL(file);
  });
}
