import { Box, Paper, Typography, Grid } from '@mui/material';
import { AccountBalance, MoneyOff, CardGiftcard, TrendingUp } from '@mui/icons-material';

const SalaryCalculator = ({ basicSalary = 0, allowances = 0, deductions = 0, bonus = 0 }) => {
  const netSalary = Number(basicSalary) + Number(allowances) + Number(bonus) - Number(deductions);
  const components = [
    { label: 'Basic Salary', value: basicSalary, color: '#1976d2', icon: <AccountBalance /> },
    { label: 'Allowances', value: allowances, color: '#388e3c', icon: <MoneyOff /> },
    { label: 'Bonus', value: bonus, color: '#f57c00', icon: <CardGiftcard /> },
    { label: 'Deductions', value: deductions, color: '#d32f2f', icon: <TrendingUp /> },
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Salary Breakdown
      </Typography>
      <Grid container spacing={2}>
        {components.map((item) => (
          <Grid size={{ xs: 6, sm: 3 }} key={item.label}>
            <Box sx={{ textAlign: 'center', p: 2, bgcolor: `${item.color}15`, borderRadius: 2 }}>
              <Box sx={{ color: item.color, mb: 1 }}>{item.icon}</Box>
              <Typography variant="body2" color="text.secondary">{item.label}</Typography>
              <Typography variant="h6" fontWeight="bold" color={item.color}>
                ${Number(item.value).toLocaleString()}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 3, p: 2, bgcolor: '#f3f3f3', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body1" fontWeight="bold">Net Salary</Typography>
        <Typography variant="h4" fontWeight="bold" color="primary">
          ${netSalary.toLocaleString()}
        </Typography>
      </Box>
    </Paper>
  );
};

export default SalaryCalculator;