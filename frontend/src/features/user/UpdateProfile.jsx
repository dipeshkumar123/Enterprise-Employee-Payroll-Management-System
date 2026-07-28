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
  Grid,
} from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { updateProfile } from '../../services/userService';
import { profileUpdateSchema } from '../../utils/validation';

const UpdateProfile = () => {
  const queryClient = useQueryClient();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(profileUpdateSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
  });

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setSnackbar({ open: true, message: 'Profile updated successfully', severity: 'success' });
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to update profile', severity: 'error' });
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Update Profile</Typography>
      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Full Name"
                  {...register('name')}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  fullWidth
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Email"
                  type="email"
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  fullWidth
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Phone"
                  {...register('phone')}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Address"
                  {...register('address')}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 3 }}>
              <Button type="submit" variant="contained" size="large" disabled={mutation.isPending}>
                {mutation.isPending ? 'Updating...' : 'Update Profile'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default UpdateProfile;
