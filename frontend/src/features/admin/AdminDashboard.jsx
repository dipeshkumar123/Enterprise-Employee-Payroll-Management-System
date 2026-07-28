import { useQuery } from '@tanstack/react-query';
import { Box, CircularProgress, Grid, Paper, Typography } from '@mui/material';
import { People, Security, History, Settings } from '@mui/icons-material';
import { getUsers, getRoles, getAuditLogs, getSystemSettings } from '../../services/adminService';

const AdminDashboard = () => {
  const { data: users } = useQuery({ queryKey: ['admin-users'], queryFn: getUsers });
  const { data: roles } = useQuery({ queryKey: ['admin-roles'], queryFn: getRoles });
  const { data: logs } = useQuery({ queryKey: ['admin-audit-logs'], queryFn: () => getAuditLogs({ page: 1 }) });
  const { data: settings } = useQuery({ queryKey: ['admin-settings'], queryFn: getSystemSettings });

  const userCount = users?.data?.length || users?.length || 0;
  const roleCount = roles?.data?.length || roles?.length || 0;
  const logCount = logs?.data?.length || logs?.length || 0;

  const cards = [
    { title: 'Total Users', value: userCount, icon: <People fontSize="large" />, color: '#1976d2' },
    { title: 'Roles', value: roleCount, icon: <Security fontSize="large" />, color: '#388e3c' },
    { title: 'Audit Logs', value: logCount, icon: <History fontSize="large" />, color: '#f57c00' },
    { title: 'System Status', value: settings?.maintenanceMode ? 'Maintenance' : 'Operational', icon: <Settings fontSize="large" />, color: '#7b1fa2' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.title}>
            <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ backgroundColor: card.color, color: 'white', borderRadius: 2, p: 1.5, display: 'flex' }}>
                {card.icon}
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">{card.title}</Typography>
                <Typography variant="h5" fontWeight="bold">{card.value}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>Recent Activity</Typography>
        <Typography variant="body2" color="text.secondary">
          Welcome to the Admin Panel. Use the sidebar to navigate through different sections.
        </Typography>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;