import axios, { AxiosResponse } from "axios";
import { getToken, logout } from "@/auth";

const axiosAuth = axios.create({
  baseURL: import.meta.env.VITE_URL_SERVER,
  timeout: 1000,
});

axiosAuth.interceptors.request.use((config) => {
  const token = getToken();

  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token.accessToken}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

axiosAuth.interceptors.response.use((response: AxiosResponse<any>) => {
  return response;
}, async (error) => {
  if (error.response && error.response.status === 401) {
    await logout();
  }
  
  return Promise.reject(error);
});

export default axiosAuth;
