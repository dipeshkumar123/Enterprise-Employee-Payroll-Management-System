import { Box, Typography, Grid, Paper } from '@mui/material';
import { AccountBalance, Receipt, AccountBalanceWallet, TrendingUp } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';

const PayrollDashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ['payroll-stats'],
    queryFn: () => Promise.resolve({
      totalPaid: 0,
      pending: 0,
      totalEmployees: 0,
      thisMonth: 0,
    }),
  });

  const cards = [
    { title: 'Total Paid', value: `$${stats?.totalPaid?.toLocaleString() || 0}`, icon: <AccountBalance />, color: '#388e3c' },
    { title: 'Pending', value: stats?.pending || 0, icon: <Receipt />, color: '#f57c00' },
    { title: 'Employees', value: stats?.totalEmployees || 0, icon: <AccountBalanceWallet />, color: '#1976d2' },
    { title: 'This Month', value: `$${stats?.thisMonth?.toLocaleString() || 0}`, icon: <TrendingUp />, color: '#7b1fa2' },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Payroll Dashboard
      </Typography>
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
    </Box>
  );
};

export default PayrollDashboard;