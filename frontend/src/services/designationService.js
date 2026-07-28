import axiosInstance from '../api/axios';

export const getDesignations = async (params = {}) => {
  const response = await axiosInstance.get('/designations', { params });
  return response.data;
};

export const getDesignationById = async (id) => {
  const response = await axiosInstance.get(`/designations/${id}`);
  return response.data;
};

export const createDesignation = async (data) => {
  const response = await axiosInstance.post('/designations', data);
  return response.data;
};

export const updateDesignation = async (id, data) => {
  const response = await axiosInstance.put(`/designations/${id}`, data);
  return response.data;
};

export const deleteDesignation = async (id) => {
  const response = await axiosInstance.delete(`/designations/${id}`);
  return response.data;
};