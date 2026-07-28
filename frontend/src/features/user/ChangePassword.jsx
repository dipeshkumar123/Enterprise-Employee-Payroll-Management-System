import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  Card,
  CardContent,
  Snackbar,
  Alert,
  TextField,
  Typography,
} from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { changePassword } from '../../services/userService';

const schema = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string().required('New password is required').min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('newPassword'), ''], 'Passwords do not match'),
});

const ChangePassword = () => {
  const queryClient = useQueryClient();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setSnackbar({ open: true, message: 'Password changed successfully', severity: 'success' });
      reset();
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to change password', severity: 'error' });
    },
  });

  const onSubmit = (data) => {
    mutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Change Password</Typography>
      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              label="Current Password"
              type="password"
              {...register('currentPassword')}
              error={!!errors.currentPassword}
              helperText={errors.currentPassword?.message}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="New Password"
              type="password"
              {...register('newPassword')}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              {...register('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              fullWidth
              required
              sx={{ mb: 3 }}
            />
            <Button type="submit" variant="contained" size="large" disabled={mutation.isPending}>
              {mutation.isPending ? 'Updating...' : 'Change Password'}
            </Button>
          </Box>
        </CardContent>
      </Card>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ChangePassword;
