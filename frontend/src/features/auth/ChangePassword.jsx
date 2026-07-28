import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button, Typography, Box } from '@mui/material';
import { changePassword as changePasswordApi } from '../../services/authService';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/notificationSlice';
import { changePasswordSchema } from '../../utils/validation';
import PasswordInput from '../../components/common/PasswordInput';

const ChangePassword = ({ onCancel }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const dispatch = useDispatch();
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(changePasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      setShowError(false);
      await changePasswordApi({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setShowSuccess(true);
      dispatch(addNotification({
        id: Date.now(),
        type: 'success',
        title: 'Password Changed',
        message: 'Your password has been changed successfully.',
        read: false,
      }));
      setTimeout(() => {
        onCancel?.();
      }, 2000);
    } catch (error) {
      setShowError(true);
      setErrorMessage(error.response?.data?.message || 'Failed to change password');
    }
  };

  if (showSuccess) {
    return (
      <Box>
        <Alert severity="success" sx={{ mb: 2 }}>
          Password changed successfully!
        </Alert>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {showError && (
        <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>
      )}
      <Typography variant="h6" gutterBottom>
        Change Password
      </Typography>
      <PasswordInput
        label="Current Password"
        error={!!errors.currentPassword}
        helperText={errors.currentPassword?.message}
        {...register('currentPassword')}
      />
      <PasswordInput
        label="New Password"
        error={!!errors.newPassword}
        helperText={errors.newPassword?.message}
        {...register('newPassword')}
      />
      <PasswordInput
        label="Confirm New Password"
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />
      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          fullWidth
        >
          Change Password
        </Button>
        <Button
          variant="outlined"
          onClick={onCancel}
          fullWidth
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default ChangePassword;