import axiosClient from '../../../shared/lib/axiosClient';

/**
 * Gets all institutional documents
 * @returns {Promise<object[]>} Documents
 */
export async function getDocuments() {
  const response = await axiosClient.get('/documentos');
  return response.data.data;
}

/**
 * Creates a new document
 * @param {object} data
 * @returns {Promise<object>} Created document
 */
export async function createDocument(data) {
  const response = await axiosClient.post('/documentos', data);
  return response.data.data;
}

/**
 * Updates an existing document
 * @param {string} id
 * @param {object} data
 * @returns {Promise<object>} Updated document
 */
export async function updateDocument(id, data) {
  const response = await axiosClient.put(`/documentos/${id}`, data);
  return response.data.data;
}

/**
 * Wrapper for creating or updating a document
 * @param {object} payload
 * @param {string} editingId
 */
export async function saveDocument(payload, editingId) {
  if (editingId) {
    return updateDocument(editingId, payload);
  } else {
    return createDocument(payload);
  }
}

/**
 * Deletes a document
 * @param {string} id
 */
export async function deleteDocument(id) {
  const response = await axiosClient.delete(`/documentos/${id}`);
  return response.data;
}

/**
 * Helper to upload files to backend media storage (converting to base64 on client-side)
 * @param {File} file
 * @param {string} folder
 * @returns {Promise<object>} Result containing error and publicUrl
 */
export async function uploadFileToStorage(file, folder = 'documents') {
  return new Promise((resolve) => {
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
