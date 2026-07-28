import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Box, Button, Checkbox, FormControlLabel, Link, Typography, useTheme, useMediaQuery } from '@mui/material';
import { login as loginApi } from '../../services/authService';
import { setCredentials } from '../../store/authSlice';
import { addNotification } from '../../store/notificationSlice';
import { loginSchema } from '../../utils/validation';
import PasswordInput from '../common/PasswordInput';
import TextField from '../common/TextField';

const LoginForm = ({ onForgotPassword, onSwitchToRegister }) => {
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setShowError(false);
      const response = await loginApi({ username: data.email, password: data.password });
      dispatch(setCredentials({
        user: response.user || { username: response.username, roles: response.roles || [] },
        token: response.token,
        refreshToken: response.refreshToken,
      }));
      dispatch(addNotification({
        id: Date.now(),
        type: 'success',
        title: 'Login Successful',
        message: 'Welcome back!',
        read: false,
      }));
    } catch (error) {
      setShowError(true);
      setErrorMessage(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: '100%' }}>
      {showError && (
        <Alert severity="error" sx={{ mb: 2, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
          {errorMessage}
        </Alert>
      )}
      <TextField
        label="Email Address"
        id="email"
        type="email"
        error={!!errors.email}
        helperText={errors.email?.message}
        {...register('email')}
        fullWidth
        margin="normal"
        required
        size={isMobile ? 'small' : 'medium'}
      />
      <PasswordInput
        label="Password"
        id="password"
        error={!!errors.password}
        helperText={errors.password?.message}
        {...register('password')}
        required
        size={isMobile ? 'small' : 'medium'}
      />
      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <FormControlLabel
          control={<Checkbox color="primary" size={isMobile ? 'small' : 'medium'} />}
          label={<Typography variant={isMobile ? 'body2' : 'body1'}>Remember me</Typography>}
        />
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onForgotPassword?.();
          }}
          variant="body2"
          sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
        >
          Forgot password?
        </Link>
      </Box>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        size={isMobile ? 'medium' : 'large'}
        disabled={loading}
        sx={{ mt: { xs: 2, sm: 3 }, mb: 2, py: { xs: 1.2, sm: 1.5 } }}
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
          Don't have an account?{' '}
          <Link href="#" onClick={(e) => { e.preventDefault(); onSwitchToRegister?.(); }} variant="body2">
            Sign up
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginForm;
