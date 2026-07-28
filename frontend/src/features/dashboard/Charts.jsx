import { memo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Box, Paper, Typography } from '@mui/material';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Charts = ({ employees = [] }) => {
  const departmentCounts = employees.reduce((counts, employee) => {
    const department = employee.department || 'Unassigned';
    counts[department] = (counts[department] || 0) + 1;
    return counts;
  }, {});
  const labels = Object.keys(departmentCounts);

  return (
    <Paper sx={{ p: { xs: 2, sm: 3 }, minHeight: 330 }}>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        Employees by Department
      </Typography>
      {labels.length ? (
        <Box sx={{ height: 260 }}>
          <Bar
            data={{
              labels,
              datasets: [{
                label: 'Employees',
                data: labels.map((label) => departmentCounts[label]),
                backgroundColor: '#1976d2',
                borderRadius: 6,
                maxBarThickness: 56,
              }],
            }}
            options={{
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
            }}
          />
        </Box>
      ) : (
        <Box sx={{ height: 250, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
          <Typography color="text.secondary">
            Add employees to see your department distribution.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default memo(Charts);
