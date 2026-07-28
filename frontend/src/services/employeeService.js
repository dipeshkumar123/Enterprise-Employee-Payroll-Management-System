import axiosInstance from '../api/axios';

export const getEmployees = async (params = {}) => {
  const response = await axiosInstance.get('/employees', { params });
  return response.data;
};

export const getEmployeeById = async (id) => {
  const response = await axiosInstance.get(`/employees/${id}`);
  return response.data;
};

export const createEmployee = async (data) => {
  const response = await axiosInstance.post('/employees', data);
  return response.data;
};

export const updateEmployee = async (id, data) => {
  const response = await axiosInstance.put(`/employees/${id}`, data);
  return response.data;
};

export const deleteEmployee = async (id) => {
  const response = await axiosInstance.delete(`/employees/${id}`);
  return response.data;
};

export const exportEmployeesCSV = async () => {
  const response = await axiosInstance.get('/employees/export/csv', {
    responseType: 'blob',
  });
  return response.data;
};

export const exportEmployeesPDF = async () => {
  const response = await axiosInstance.get('/employees/export/pdf', {
    responseType: 'blob',
  });
  return response.data;
};