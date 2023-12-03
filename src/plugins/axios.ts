import axios from 'axios';

const axiosIns = axios.create({
  baseURL: import.meta.env.VITE_URL_SERVER,
  timeout: 5000,
});

export default axiosIns;
