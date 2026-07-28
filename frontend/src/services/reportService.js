import axiosInstance from '../api/axios';

export const getEmployeeReport = async (params = {}) => {
  const response = await axiosInstance.get('/reports/employees', { params });
  return response.data;
};

export const getAttendanceReport = async (params = {}) => {
  const response = await axiosInstance.get('/reports/attendance', { params });
  return response.data;
};

export const getPayrollReport = async (params = {}) => {
  const response = await axiosInstance.get('/reports/payroll', { params });
  return response.data;
};

export const getDepartmentReport = async (params = {}) => {
  const response = await axiosInstance.get('/reports/departments', { params });
  return response.data;
};

export const downloadReport = async (type, format) => {
  const response = await axiosInstance.post(`/reports/${type}/download`, { format }, { responseType: 'blob' });
  return response.data;
};