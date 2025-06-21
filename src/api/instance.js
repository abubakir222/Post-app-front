import axios from "axios";

const instance = axios.create({
  // baseURL: "http://localhost:4000",
  baseURL: "https://post-app-backend-sprx.onrender.com/api",
});

instance.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;