import { useState } from 'react';
import { Box, Grid, Paper, Typography, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const startDay = (year, month) => new Date(year, month, 1).getDay();

const statusColors = {
  Present: '#388e3c',
  Absent: '#d32f2f',
  Leave: '#f57c00',
  HalfDay: '#1565c0',
};

const AttendanceCalendar = ({ records = [], year: propYear, month: propMonth }) => {
  const now = new Date();
  const [year, setYear] = useState(propYear || now.getFullYear());
  const [month, setMonth] = useState(propMonth || now.getMonth());

  const totalDays = daysInMonth(year, month);
  const start = startDay(year, month);

  const recordMap = {};
  records.forEach((r) => {
    recordMap[r.date] = r.status;
  });

  const handlePrev = () => {
    if (month === 0) { setYear(year - 1); setMonth(11); }
    else { setMonth(month - 1); }
  };

  const handleNext = () => {
    if (month === 11) { setYear(year + 1); setMonth(0); }
    else { setMonth(month + 1); }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
        <IconButton onClick={handlePrev}><ChevronLeft /></IconButton>
        <Typography variant="h6" fontWeight="bold">
          {monthNames[month]} {year}
        </Typography>
        <IconButton onClick={handleNext}><ChevronRight /></IconButton>
      </Box>
      <Grid container spacing={0.5}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <Grid size={{ xs: 12 / 7 }} key={d}>
            <Typography variant="caption" align="center" display="block" color="text.secondary" fontWeight="bold">
              {d}
            </Typography>
          </Grid>
        ))}
        {Array.from({ length: start }).map((_, i) => (
          <Grid size={{ xs: 12 / 7 }} key={`empty-${i}`}>
            <Box sx={{ height: 40 }} />
          </Grid>
        ))}
        {Array.from({ length: totalDays }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const status = recordMap[dateStr];
          return (
            <Grid size={{ xs: 12 / 7 }} key={dateStr}>
              <Box
                sx={{
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 1,
                  bgcolor: status ? statusColors[status] : 'transparent',
                  color: status ? 'white' : 'text.primary',
                  fontSize: '0.875rem',
                  fontWeight: status ? 'bold' : 'normal',
                }}
              >
                {day}
              </Box>
            </Grid>
          );
        })}
      </Grid>
      <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'center' }}>
        {Object.entries(statusColors).map(([label, color]) => (
          <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: color }} />
            <Typography variant="caption">{label}</Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default AttendanceCalendar;