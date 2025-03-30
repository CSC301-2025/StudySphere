
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api", // Use relative path that will be proxied
  withCredentials: true,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
