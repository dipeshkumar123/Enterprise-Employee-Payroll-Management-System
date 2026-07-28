import { Paper, Typography } from '@mui/material';
const RecentActivity = () => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Recent Activities
      </Typography>
      <Typography color="text.secondary" variant="body2" sx={{ py: 3, textAlign: 'center' }}>
        Activity will appear here as employees, attendance, and payroll records are created.
      </Typography>
    </Paper>
  );
};

export default RecentActivity;
