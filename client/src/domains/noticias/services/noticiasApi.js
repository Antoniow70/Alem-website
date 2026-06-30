import axiosClient from '../../../shared/lib/axiosClient';

/**
 * Busca todas as noticias
 * @returns {Promise<object[]>} Lista de noticias
 */
export async function getNews() {
  const response = await axiosClient.get('/noticias');
  return response.data.data;
}

/**
 * Busca uma noticia pelo ID
 * @param {string} id
 * @returns {Promise<object>} Noticia
 */
export async function getNewsById(id) {
  const response = await axiosClient.get(`/noticias/${id}`);
  return response.data.data;
}

/**
 * Cria uma nova noticia
 * @param {object} data
 * @returns {Promise<object>} Noticia criada
 */
export async function createNewsItem(data) {
  const response = await axiosClient.post('/noticias', data);
  return response.data.data;
}

/**
 * Atualiza uma noticia existente
 * @param {string} id
 * @param {object} data
 * @returns {Promise<object>} Noticia atualizada
 */
export async function updateNewsItem(id, data) {
  const response = await axiosClient.put(`/noticias/${id}`, data);
  return response.data.data;
}

/**
 * Elimina uma noticia
 * @param {string} id
 */
export async function deleteNewsItem(id) {
  const response = await axiosClient.delete(`/noticias/${id}`);
  return response.data;
}

/**
 * Helper: salvar (criar ou editar) noticia
 */
export async function saveNews(payload, id = null) {
  if (id) {
    return updateNewsItem(id, payload);
  }
  return createNewsItem(payload);
}
