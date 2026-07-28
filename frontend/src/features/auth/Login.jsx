import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import LoginForm from '../../components/ui/LoginForm';
import ForgotPassword from './ForgotPassword';

const Login = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
  };

  if (showForgotPassword) {
    return <ForgotPassword onBackToLogin={handleBackToLogin} />;
  }

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom align="center">
        Sign In
      </Typography>
      <LoginForm onForgotPassword={handleForgotPassword} onSwitchToRegister={() => navigate('/register')} />
    </Box>
  );
};

export default Login;
