import axiosClient from '../../../shared/lib/axiosClient';

/**
 * Logs in the admin user using the Node.js REST API
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} Session data
 */
export async function loginAdmin(email, password) {
  const response = await axiosClient.post('/auth/login', { email, password });
  const data = response.data.data;
  if (data?.session) {
    localStorage.setItem('sb-session', JSON.stringify(data.session));
  }
  return data;
}

/**
 * Logs out the admin user using the Node.js REST API
 */
export async function logoutAdmin() {
  try {
    await axiosClient.post('/auth/logout');
  } catch (e) {
    console.error('Sign out error in backend:', e);
  } finally {
    localStorage.removeItem('sb-session');
  }
}

/**
 * Validates the current session token with the Node.js REST API
 * @returns {Promise<object|null>} The active session or null
 */
export async function getCurrentSession() {
  const sessionStr = localStorage.getItem('sb-session');
  if (!sessionStr) return null;
  
  try {
    const session = JSON.parse(sessionStr);
    if (!session?.access_token) return null;
    
    const response = await axiosClient.get('/auth/me');
    if (response.data.success) {
      return session;
    }
  } catch (e) {
    console.error('Error verifying session:', e);
    localStorage.removeItem('sb-session');
  }
  return null;
}
