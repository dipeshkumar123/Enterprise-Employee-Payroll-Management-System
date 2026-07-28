import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button, Typography } from '@mui/material';
import { Box } from '@mui/material';
import { forgotPassword as forgotPasswordApi } from '../../services/authService';
import { forgotPasswordSchema } from '../../utils/validation';
import TextField from '../../components/common/TextField';

const ForgotPassword = ({ onBackToLogin }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      setShowError(false);
      await forgotPasswordApi(data.email);
      setShowSuccess(true);
    } catch (error) {
      setShowError(true);
      setErrorMessage(error.response?.data?.message || 'Failed to process request');
    }
  };

  if (showSuccess) {
    return (
      <Box>
        <Alert severity="success" sx={{ mb: 2 }}>
          Password reset link sent to your email!
        </Alert>
        <Button variant="text" onClick={onBackToLogin}>
          Back to Login
        </Button>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h5" component="h2" gutterBottom align="center">
        Forgot Password
      </Typography>
      {showError && (
        <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>
      )}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Enter your email and we'll send you a link to reset your password.
      </Typography>
      <TextField
        label="Email"
        type="email"
        error={!!errors.email}
        helperText={errors.email?.message}
        {...register('email')}
        fullWidth
        margin="normal"
        required
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        sx={{ mt: 3, mb: 2 }}
      >
        Send Reset Link
      </Button>
      <Button variant="text" onClick={onBackToLogin} fullWidth>
        Back to Login
      </Button>
    </Box>
  );
};

export default ForgotPassword;
