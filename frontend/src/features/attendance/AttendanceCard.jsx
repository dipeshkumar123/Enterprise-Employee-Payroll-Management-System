import { Box, Paper, Typography } from '@mui/material';
import { CheckCircle, Cancel, Schedule, TrendingUp } from '@mui/icons-material';

const cards = [
  {
    title: 'Present Today',
    value: 0,
    icon: <CheckCircle fontSize="large" />,
    color: '#388e3c',
  },
  {
    title: 'Absent Today',
    value: 0,
    icon: <Cancel fontSize="large" />,
    color: '#d32f2f',
  },
  {
    title: 'On Leave',
    value: 0,
    icon: <Schedule fontSize="large" />,
    color: '#f57c00',
  },
  {
    title: 'Attendance Rate',
    value: '0%',
    icon: <TrendingUp fontSize="large" />,
    color: '#1976d2',
  },
];

const AttendanceCard = ({ stats }) => {
  return (
    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
      {cards.map((card) => (
        <Paper
          key={card.title}
          sx={{
            flex: '1 1 200px',
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
      ))}
    </Box>
  );
};

export default AttendanceCard;