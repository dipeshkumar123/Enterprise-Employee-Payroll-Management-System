import { Grid, Paper, Typography, Button, Box } from '@mui/material';
import {
  PersonAdd,
  EventNote,
  Receipt,
  Assessment,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const actions = [
  {
    label: 'Add Employee',
    icon: <PersonAdd />,
    path: '/employees/add',
    color: '#1976d2',
  },
  {
    label: 'Mark Attendance',
    icon: <EventNote />,
    path: '/attendance',
    color: '#388e3c',
  },
  {
    label: 'Process Payroll',
    icon: <Receipt />,
    path: '/payroll',
    color: '#f57c00',
  },
  {
    label: 'View Reports',
    icon: <Assessment />,
    path: '/reports',
    color: '#7b1fa2',
  },
];

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Quick Actions
      </Typography>
      <Grid container spacing={2}>
        {actions.map((action) => (
          <Grid size={{ xs: 12, sm: 6 }} key={action.label}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={action.icon}
              onClick={() => navigate(action.path)}
              sx={{
                py: 1.5,
                justifyContent: 'flex-start',
                borderColor: action.color,
                color: action.color,
                '&:hover': {
                  borderColor: action.color,
                  backgroundColor: `${action.color}10`,
                },
              }}
            >
              {action.label}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default QuickActions;
