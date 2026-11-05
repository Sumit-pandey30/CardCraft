import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor: Attach JWT Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cardcraft_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle automatic refresh token rotation & 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 Unauthorized and not already retried
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/')) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('cardcraft_refresh_token');

      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
          const { accessToken, refreshToken: newRefreshToken } = res.data.data;
          
          localStorage.setItem('cardcraft_token', accessToken);
          if (newRefreshToken) {
            localStorage.setItem('cardcraft_refresh_token', newRefreshToken);
          }

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshErr) {
          // Refresh failed - clear tokens and trigger logout
          localStorage.removeItem('cardcraft_token');
          localStorage.removeItem('cardcraft_refresh_token');
          localStorage.removeItem('cardcraft_user');
          window.location.href = '/login?expired=true';
        }
      } else {
        localStorage.removeItem('cardcraft_token');
        localStorage.removeItem('cardcraft_user');
      }
    }

    return Promise.reject(error);
  }
);

export default api;
