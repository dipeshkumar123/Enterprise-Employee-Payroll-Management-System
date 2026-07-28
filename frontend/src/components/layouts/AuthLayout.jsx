import { Outlet } from 'react-router-dom';
import { Box, Container, Typography, useTheme, useMediaQuery, Paper } from '@mui/material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

const AuthLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a2540 0%, #1e3d59 50%, #00d4b2 100%)',
        position: 'relative',
        overflow: 'hidden',
        px: { xs: 1, sm: 2 },
      }}
    >
      {/* Decorative circles */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: { xs: 200, sm: 400 },
          height: { xs: 200, sm: 400 },
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.03)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -80,
          left: -80,
          width: { xs: 150, sm: 300 },
          height: { xs: 150, sm: 300 },
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.03)',
        }}
      />

      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={isMobile ? 0 : 8}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: { xs: 3, sm: 4 },
            borderRadius: { xs: 0, sm: 3 },
            bgcolor: 'background.paper',
            backdropFilter: 'blur(10px)',
            width: '100%',
          }}
        >
          {/* Logo area */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              mb: 1,
            }}
          >
            <BusinessCenterIcon
              sx={{
                fontSize: { xs: 32, sm: 40 },
                color: 'primary.main',
              }}
            />
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              component="h1"
              fontWeight="bold"
              color="primary"
              sx={{ letterSpacing: '-0.02em' }}
            >
              Payroll System
            </Typography>
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: { xs: 2, sm: 3 }, textAlign: 'center' }}
          >
            Enterprise Employee & Payroll Management
          </Typography>

          {/* Divider */}
          <Box
            sx={{
              width: 60,
              height: 3,
              bgcolor: 'secondary.main',
              borderRadius: 2,
              mb: { xs: 2, sm: 3 },
            }}
          />

          <Outlet />
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthLayout;
