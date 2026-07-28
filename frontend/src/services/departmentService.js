import axiosInstance from '../api/axios';

export const getDepartments = async (params = {}) => {
  const response = await axiosInstance.get('/departments', { params });
  return response.data;
};

export const getDepartmentById = async (id) => {
  const response = await axiosInstance.get(`/departments/${id}`);
  return response.data;
};

export const createDepartment = async (data) => {
  const response = await axiosInstance.post('/departments', data);
  return response.data;
};

export const updateDepartment = async (id, data) => {
  const response = await axiosInstance.put(`/departments/${id}`, data);
  return response.data;
};

export const deleteDepartment = async (id) => {
  const response = await axiosInstance.delete(`/departments/${id}`);
  return response.data;
};

export const getDepartmentEmployees = async (id, params = {}) => {
  const response = await axiosInstance.get(`/departments/${id}/employees`, { params });
  return response.data;
};