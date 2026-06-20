import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token if available
axiosClient.interceptors.request.use(
  (config) => {
    const sessionStr = localStorage.getItem('sb-session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        if (session?.access_token) {
          config.headers.Authorization = `Bearer ${session.access_token}`;
        }
      } catch (e) {
        console.error('Error parsing session from local storage', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;
