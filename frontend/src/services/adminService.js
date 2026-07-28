import axiosInstance from '../api/axios';

export const getUsers = async (params = {}) => {
  const response = await axiosInstance.get('/admin/users', { params });
  return response.data;
};

export const getUserById = async (id) => {
  const response = await axiosInstance.get(`/admin/users/${id}`);
  return response.data;
};

export const createUser = async (data) => {
  const response = await axiosInstance.post('/admin/users', data);
  return response.data;
};

export const updateUser = async (id, data) => {
  const response = await axiosInstance.put(`/admin/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axiosInstance.delete(`/admin/users/${id}`);
  return response.data;
};

export const getRoles = async () => {
  const response = await axiosInstance.get('/admin/roles');
  return response.data;
};

export const createRole = async (data) => {
  const response = await axiosInstance.post('/admin/roles', data);
  return response.data;
};

export const updateRole = async (id, data) => {
  const response = await axiosInstance.put(`/admin/roles/${id}`, data);
  return response.data;
};

export const deleteRole = async (id) => {
  const response = await axiosInstance.delete(`/admin/roles/${id}`);
  return response.data;
};

export const getPermissions = async () => {
  const response = await axiosInstance.get('/admin/permissions');
  return response.data;
};

export const getAuditLogs = async (params = {}) => {
  const response = await axiosInstance.get('/admin/audit-logs', { params });
  return response.data;
};

export const getSystemSettings = async () => {
  const response = await axiosInstance.get('/admin/settings');
  return response.data;
};

export const updateSystemSettings = async (data) => {
  const response = await axiosInstance.put('/admin/settings', data);
  return response.data;
};