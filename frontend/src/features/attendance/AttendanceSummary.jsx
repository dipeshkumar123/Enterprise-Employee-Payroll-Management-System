import { Box, Grid, Paper, Typography } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const AttendanceSummary = ({ summary }) => {
  const data = {
    labels: ['Present', 'Absent', 'Leave', 'Half Day'],
    datasets: [
      {
        data: [
          summary?.present || 0,
          summary?.absent || 0,
          summary?.leave || 0,
          summary?.halfDay || 0,
        ],
        backgroundColor: ['#388e3c', '#d32f2f', '#f57c00', '#1565c0'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Attendance Distribution
          </Typography>
          <Box sx={{ maxWidth: 300, mx: 'auto' }}>
            <Pie
              data={data}
              options={{
                plugins: { legend: { position: 'bottom' } },
                maintainAspectRatio: true,
              }}
            />
          </Box>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Monthly Statistics
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#e8f5e9', borderRadius: 2 }}>
                <Typography variant="h4" color="#2e7d32" fontWeight="bold">
                  {summary?.present || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">Present</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#fce4ec', borderRadius: 2 }}>
                <Typography variant="h4" color="#c62828" fontWeight="bold">
                  {summary?.absent || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">Absent</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#fff3e0', borderRadius: 2 }}>
                <Typography variant="h4" color="#e65100" fontWeight="bold">
                  {summary?.leave || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">On Leave</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
                <Typography variant="h4" color="#1565c0" fontWeight="bold">
                  {summary?.halfDay || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">Half Day</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AttendanceSummary;
