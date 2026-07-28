import { Grid, Paper, Typography, Box } from '@mui/material';
import {
  PeopleAlt,
  AccessTime,
  AttachMoney,
  PendingActions,
} from '@mui/icons-material';

const createCards = (stats) => [
  {
    title: 'Total Employees',
    value: stats.totalEmployees,
    icon: <PeopleAlt fontSize="large" />,
    color: '#1976d2',
  },
  {
    title: "Today's Attendance",
    value: stats.attendance,
    icon: <AccessTime fontSize="large" />,
    color: '#388e3c',
  },
  {
    title: 'Monthly Payroll',
    value: stats.monthlyPayroll,
    icon: <AttachMoney fontSize="large" />,
    color: '#f57c00',
  },
  {
    title: 'Pending Salary',
    value: stats.pendingSalary,
    icon: <PendingActions fontSize="large" />,
    color: '#d32f2f',
  },
];

const DashboardCards = ({ stats = {} }) => {
  const cards = createCards(stats);
  return (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.title}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box
              sx={{
                backgroundColor: card.color,
                color: 'white',
                borderRadius: 2,
                p: 1.5,
                display: 'flex',
              }}
            >
              {card.icon}
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {card.title}
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {card.value}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardCards;
