import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && config.headers) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

export default api;
