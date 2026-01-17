import axios from 'axios';
import toast from 'react-hot-toast';
import { getAuthSetters } from '../context/authContext';
import { logoutUser } from './userApi';

// variables to handle race conditions
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // Enables sending cookies with every request
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor to add an Authorization header with a Bearer token (if available) to every outgoing request.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config;
}, (error) => {
  return Promise.reject(error)
})



// Response Interceptor to handle token refresh
apiClient.interceptors.response.use(
  response => response, // If the request is successful, return the response
  async (error) => {
    const originalRequest = error.config;

    // If no response object, it's likely a network error or timeout → just reject
    if (!error.response) {
      return Promise.reject(error);
    }

    // Prevent infinite loop: don't retry for the refresh-token endpoint itself
    const isRefreshRequest = originalRequest.url.includes('/users/refresh-token');

    // If the error is 401, try to refresh the access token
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !isRefreshRequest &&
      error.response?.data?.message !== 'Invalid credentials'
    ) {
      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          if (token) {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return apiClient(originalRequest);
          }
          return Promise.reject(error);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true; // Mark this request as retried
      isRefreshing = true;

      try {
        // Request a new access token using the refresh token
        const refreshResponse = await apiClient.post('/users/refresh-token', {}, { withCredentials: true });

        const newAccessToken = refreshResponse.data.data.accessToken;

        localStorage.setItem('accessToken', newAccessToken);

        // Process all queued requests with the new token
        processQueue(null, newAccessToken);

        // Update the Authorization header with the new access token
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Retry the original request with the new token
        return apiClient(originalRequest);

      } catch (refreshError) {
        console.error('Refresh token failed', refreshError);

        // Process queued requests with error
        processQueue(refreshError, null);

        toast('Your session has expired. Please log in again.')

        // Clear local state immediately
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');

        const { setUser } = getAuthSetters()
        setUser(null);

        try {
          await logoutUser();
        } catch (logoutError) {
          console.error('Logout failed:', logoutError);
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;