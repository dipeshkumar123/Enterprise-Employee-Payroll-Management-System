import { Box, Paper, Typography } from '@mui/material';
import { People } from '@mui/icons-material';

const DepartmentCard = ({ department }) => {
  return (
    <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box
        sx={{
          backgroundColor: '#1976d2',
          color: 'white',
          borderRadius: 2,
          p: 1.5,
          display: 'flex',
        }}
      >
        <People fontSize="large" />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          {department.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manager: {department.manager || 'Not assigned'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {department.employeeCount || 0} employees
        </Typography>
      </Box>
    </Paper>
  );
};

export default DepartmentCard;