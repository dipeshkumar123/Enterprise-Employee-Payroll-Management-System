import axiosInstance from '../api/axios';

export const getProfile = async () => {
  const response = await axiosInstance.get('/users/profile');
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await axiosInstance.put('/users/profile', data);
  return response.data;
};

export const uploadProfilePhoto = async (formData) => {
  const response = await axiosInstance.post('/users/profile/photo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const changePassword = async (data) => {
  const response = await axiosInstance.post('/users/change-password', data);
  return response.data;
};