import { Box, Paper, Typography, Divider, Grid } from '@mui/material';
import { AccountBalance, Event, AttachMoney, CalendarToday } from '@mui/icons-material';

const PayslipViewer = ({ payslip }) => {
  if (!payslip) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">No payslip data available</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Payslip</Typography>
        <Typography variant="body2" color="text.secondary">
          {payslip.month} {payslip.year}
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6 }}>
          <Typography variant="body2" color="text.secondary">Employee Name</Typography>
          <Typography variant="body1" fontWeight="bold">
            {payslip.employeeName || `${payslip.firstName || ''} ${payslip.lastName || ''}`}
          </Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Typography variant="body2" color="text.secondary">Employee ID</Typography>
          <Typography variant="body1" fontWeight="bold">{payslip.employeeId}</Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Typography variant="body2" color="text.secondary">Designation</Typography>
          <Typography variant="body1">{payslip.designation || '-'}</Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Typography variant="body2" color="text.secondary">Department</Typography>
          <Typography variant="body1">{payslip.department || '-'}</Typography>
        </Grid>
      </Grid>
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={1}>
          <Grid size={{ xs: 6 }}><Typography variant="body2">Basic Salary</Typography></Grid>
          <Grid size={{ xs: 6 }} sx={{ textAlign: 'right' }}><Typography variant="body1">${payslip.basicSalary?.toLocaleString() || 0}</Typography></Grid>
          <Grid size={{ xs: 6 }}><Typography variant="body2">Allowances</Typography></Grid>
          <Grid size={{ xs: 6 }} sx={{ textAlign: 'right' }}><Typography variant="body1">+${payslip.allowances?.toLocaleString() || 0}</Typography></Grid>
          <Grid size={{ xs: 6 }}><Typography variant="body2">Bonus</Typography></Grid>
          <Grid size={{ xs: 6 }} sx={{ textAlign: 'right' }}><Typography variant="body1">+${payslip.bonus?.toLocaleString() || 0}</Typography></Grid>
          <Grid size={{ xs: 6 }}><Typography variant="body2">Deductions</Typography></Grid>
          <Grid size={{ xs: 6 }} sx={{ textAlign: 'right' }}><Typography variant="body1" color="error">-${payslip.deductions?.toLocaleString() || 0}</Typography></Grid>
          <Divider sx={{ width: '100%', my: 1 }} />
          <Grid size={{ xs: 6 }}><Typography variant="subtitle1" fontWeight="bold">Net Salary</Typography></Grid>
          <Grid size={{ xs: 6 }} sx={{ textAlign: 'right' }}><Typography variant="h6" fontWeight="bold" color="primary">${payslip.netSalary?.toLocaleString() || 0}</Typography></Grid>
        </Grid>
      </Paper>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'text.secondary' }}>
        <Typography variant="caption">Generated on: {new Date().toLocaleDateString()}</Typography>
        <Typography variant="caption">Status: {payslip.status || 'Pending'}</Typography>
      </Box>
    </Paper>
  );
};

export default PayslipViewer;