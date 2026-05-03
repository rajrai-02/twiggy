import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true, // HTTP-only cookies are sent automatically by the browser
});

// Response interceptor — handle 401 (token expired) and auto-refresh via cookie
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If we get a 401 and haven't retried yet, attempt a token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Call the refresh endpoint — backend sets a new HTTP-only cookie automatically
        await axiosClient.post('/auth/refresh');
        return axiosClient(originalRequest); // Retry the original request with the new cookie
      } catch (refreshError) {
        // Refresh failed (refresh token also expired) — clear user session and redirect
        sessionStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
