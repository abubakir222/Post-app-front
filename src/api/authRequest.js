import axios from 'axios';

const BASE_URL = "https://post-app-backend-wpnl.onrender.com/api"; 
const API = axios.create({ baseURL: BASE_URL });

export const register = (formData) => API.post('/signup', formData);
export const login = ({ email, password }) => API.post('/login', { email, password });