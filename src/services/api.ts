import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const res = await axios.post(
          `${API_URL}/auth/refresh`,
          { refreshToken }
        );

        const newToken = res.data.accessToken;
        localStorage.setItem('accessToken', newToken);

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.accessToken = newToken;
        localStorage.setItem('user', JSON.stringify(user));

        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        localStorage.clear();
        window.location.href = '/login';
      }
    }

    if (error.response?.status === 403) {
      console.warn('403 Forbidden - token expiré ou accès refusé');
      localStorage.clear();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
