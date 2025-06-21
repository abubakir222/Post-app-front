import axios from 'axios';

const BASE_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:4000/api';

export const register = (formData) => {
  return axios.post(`${BASE_URL}/signup`, formData);
};

export const login = (formData) => {
  return axios.post(`${BASE_URL}/login`, formData);
};