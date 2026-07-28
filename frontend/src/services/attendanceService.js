import axiosInstance from '../api/axios';

export const getAttendance = async (params = {}) => {
  const response = await axiosInstance.get('/attendance', { params });
  return response.data;
};

export const markAttendance = async (data) => {
  const response = await axiosInstance.post('/attendance', data);
  return response.data;
};

export const updateAttendance = async (id, data) => {
  const response = await axiosInstance.put(`/attendance/${id}`, data);
  return response.data;
};

export const getAttendanceReport = async (params = {}) => {
  const response = await axiosInstance.get('/attendance/report', { params });
  return response.data;
};

export const getMonthlySummary = async (year, month) => {
  const response = await axiosInstance.get('/attendance/summary', { params: { year, month } });
  return response.data;
};

export const markMyAttendance = async () => {
  const response = await axiosInstance.post('/attendance/me');
  return response.data;
};
