import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        padding: 3,
      }}
    >
      <Typography variant="h1" component="h1" gutterBottom color="error">
        403
      </Typography>
      <Typography variant="h4" component="h2" gutterBottom>
        Unauthorized Access
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
        You do not have permission to access this page. Please contact your administrator if you believe this is an error.
      </Typography>
      <Button variant="contained" size="large" onClick={() => navigate('/dashboard')}>
        Go to Dashboard
      </Button>
    </Box>
  );
};

export default Unauthorized;