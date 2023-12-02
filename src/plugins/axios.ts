import axios from 'axios';

const axiosIns = axios.create({
  baseURL: import.meta.env.VITE_URL_SERVER,
  timeout: 1000,
});

export default axiosIns;
