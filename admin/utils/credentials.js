import axios from "axios";

const axiosInstance = axios.create({
    baseURL:import.meta.env.VITE_BACKEND_URL,
    withCredentials:true
})

// ✅ Add response interceptor to handle cookie issues
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Authentication failed');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;