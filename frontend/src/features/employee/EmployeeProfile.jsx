import {
  Avatar,
  Box,
  Chip,
  Divider,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import {
  Email,
  Phone,
  Business,
  Work,
  AttachMoney,
  CalendarToday,
} from '@mui/icons-material';

const DetailRow = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
    <Box sx={{ color: 'text.secondary', display: 'flex' }}>{icon}</Box>
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">{value || '-'}</Typography>
    </Box>
  </Box>
);

const EmployeeProfile = ({ employee }) => {
  if (!employee) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">No employee selected</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
        <Avatar
          sx={{ width: 80, height: 80, bgcolor: '#1976d2', fontSize: 32 }}
        >
          {employee.firstName?.[0]}{employee.lastName?.[0]}
        </Avatar>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            {employee.firstName} {employee.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {employee.designation}
          </Typography>
          <Chip
            label={employee.status || 'Active'}
            size="small"
            sx={{
              mt: 0.5,
              bgcolor: employee.status === 'Active' ? '#e8f5e9' : '#fce4ec',
              color: employee.status === 'Active' ? '#2e7d32' : '#c62828',
              fontWeight: 'bold',
            }}
          />
        </Box>
      </Box>
      <Divider sx={{ mb: 3 }} />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <DetailRow icon={<Email />} label="Email" value={employee.email} />
          <DetailRow icon={<Phone />} label="Phone" value={employee.phone} />
          <DetailRow icon={<Business />} label="Department" value={employee.department} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <DetailRow icon={<Work />} label="Designation" value={employee.designation} />
          <DetailRow icon={<AttachMoney />} label="Salary" value={employee.salary ? `$${employee.salary.toLocaleString()}` : '-'} />
          <DetailRow icon={<CalendarToday />} label="Date of Joining" value={employee.dateOfJoining} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default EmployeeProfile;