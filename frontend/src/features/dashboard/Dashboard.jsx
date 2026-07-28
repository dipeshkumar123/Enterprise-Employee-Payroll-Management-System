import { Box, Grid, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import DashboardCards from './DashboardCards';
import Charts from './Charts';
import RecentActivity from './RecentActivity';
import QuickActions from './QuickActions';
import { getEmployees } from '../../services/employeeService';

const Dashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getEmployees,
  });
  const employees = Array.isArray(data) ? data : data?.content || data?.data || [];
  const stats = {
    totalEmployees: isLoading ? '—' : employees.length,
    attendance: 'No data',
    monthlyPayroll: 'No data',
    pendingSalary: 'No data',
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Box sx={{ mb: 4 }}>
        <DashboardCards stats={stats} />
      </Box>
      <Box sx={{ mb: 4 }}>
        <Charts employees={employees} />
      </Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <RecentActivity />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <QuickActions />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
