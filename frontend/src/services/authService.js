import axios from 'axios';
import axiosInstance from '../api/axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data;
};

export const register = async (data) => {
  const response = await axios.post(`${API_URL}/auth/register`, data);
  return response.data;
};

export const logout = async () => {
  await axios.post(`${API_URL}/auth/logout`);
};

export const refreshToken = async () => {
  const response = await axios.post(`${API_URL}/auth/refresh-token`);
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
  return response.data;
};

export const changePassword = async (data) => {
  const response = await axiosInstance.post('/auth/change-password', data);
  return response.data;
};
