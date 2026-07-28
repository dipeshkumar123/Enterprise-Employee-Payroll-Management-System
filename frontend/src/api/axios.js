import axios from 'axios';
import { store } from '../store';
import { clearCredentials } from '../store/authSlice';
import { isTokenExpired } from '../utils/jwt';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Track if we're currently refreshing to avoid concurrent refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor - Attach JWT and check expiry
axiosInstance.interceptors.request.use(
  (config) => {
    const { token } = store.getState().auth;

    if (token) {
      // Check if token is about to expire (within 30 seconds)
      if (isTokenExpired(token)) {
        // We'll let the response interceptor handle the 401
        // But we don't block the request - the backend will reject it
        config._tokenExpired = true;
      }
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle 401, 403, token expiry
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't retry if already retried or if it's an auth endpoint
    if (originalRequest._retry) {
      // If already retried and still failing, force logout
      if (error.response?.status === 401) {
        store.dispatch(clearCredentials());
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const { refreshToken } = store.getState().auth;

      if (!refreshToken) {
        store.dispatch(clearCredentials());
        window.location.href = '/login';
        return Promise.reject(error);
      }

      // Queue the request if already refreshing
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const { token: newToken, refreshToken: newRefreshToken, user } = response.data;

        // Store new tokens
        const { setCredentials } = await import('../store/authSlice');
        store.dispatch(setCredentials({
          user: user || store.getState().auth.user,
          token: newToken,
          refreshToken: newRefreshToken,
        }));

        // Process queued requests
        processQueue(null, newToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        store.dispatch(clearCredentials());
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle 403 Forbidden - Insufficient permissions
    if (error.response?.status === 403) {
      const { addNotification } = await import('../store/notificationSlice');
      store.dispatch(addNotification({
        id: Date.now(),
        type: 'error',
        title: 'Access Denied',
        message: 'You do not have permission to perform this action.',
        read: false,
      }));
      return Promise.reject(error);
    }

    // Handle network errors
    if (!error.response) {
      const { addNotification } = await import('../store/notificationSlice');
      store.dispatch(addNotification({
        id: Date.now(),
        type: 'error',
        title: 'Network Error',
        message: 'Unable to connect to the server. Please check your connection.',
        read: false,
      }));
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
