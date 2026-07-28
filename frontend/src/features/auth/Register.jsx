import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Box, Button, Link, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import TextField from '../../components/common/TextField';
import PasswordInput from '../../components/common/PasswordInput';
import { register as registerAccount } from '../../services/authService';
import { setCredentials } from '../../store/authSlice';
import { registerSchema } from '../../utils/validation';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      setErrorMessage('');
      const response = await registerAccount({
        username: data.username.trim(),
        email: data.email.trim(),
        password: data.password,
      });
      dispatch(setCredentials({
        user: { username: response.username, roles: response.roles || [] },
        token: response.token,
        refreshToken: response.refreshToken,
      }));
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message
        || error.response?.data?.error
        || 'Unable to create your account. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: '100%' }}>
      <Typography variant="h5" component="h2" gutterBottom align="center">
        Create account
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
        Set up your employee portal account.
      </Typography>
      {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
      <TextField label="Username" error={!!errors.username} helperText={errors.username?.message} {...register('username')} required fullWidth margin="normal" />
      <TextField label="Email Address" type="email" error={!!errors.email} helperText={errors.email?.message} {...register('email')} required fullWidth margin="normal" />
      <PasswordInput label="Password" error={!!errors.password} helperText={errors.password?.message} {...register('password')} required />
      <PasswordInput label="Confirm password" error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} {...register('confirmPassword')} required />
      <Button type="submit" fullWidth variant="contained" size="large" disabled={submitting} sx={{ mt: 3, mb: 2 }}>
        {submitting ? 'Creating account…' : 'Create account'}
      </Button>
      <Typography variant="body2" align="center">
        Already have an account?{' '}
        <Link component={RouterLink} to="/login">Sign in</Link>
      </Typography>
    </Box>
  );
};

export default Register;
