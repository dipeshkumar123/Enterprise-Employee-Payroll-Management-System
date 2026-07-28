import axiosInstance from '../api/axios';

export const getPayroll = async (params = {}) => {
  const response = await axiosInstance.get('/payroll', { params });
  return response.data;
};

export const generatePayroll = async (data) => {
  const response = await axiosInstance.post('/payroll/generate', data);
  return response.data;
};

export const getSalaryStructure = async () => {
  const response = await axiosInstance.get('/payroll/salary-structure');
  return response.data;
};

export const updateSalaryStructure = async (id, data) => {
  const response = await axiosInstance.put(`/payroll/salary-structure/${id}`, data);
  return response.data;
};

export const getPayslip = async (id) => {
  const response = await axiosInstance.get(`/payroll/payslip/${id}`);
  return response.data;
};

export const getPayrollHistory = async (params = {}) => {
  const response = await axiosInstance.get('/payroll/history', { params });
  return response.data;
};

export const downloadPayslipPDF = async (id) => {
  const response = await axiosInstance.get(`/payroll/payslip/${id}/pdf`, {
    responseType: 'blob',
  });
  return response.data;
};