import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import AttendanceSummary from './AttendanceSummary';
import AttendanceCalendar from './AttendanceCalendar';
import { getMonthlySummary, getAttendance } from '../../services/attendanceService';

const MonthlyAttendance = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['attendance-summary', year, month],
    queryFn: () => getMonthlySummary(year, month),
  });

  const { data: records } = useQuery({
    queryKey: ['attendance', 'monthly', year, month],
    queryFn: () => getAttendance({ year, month }),
  });

  if (summaryLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <Typography variant="h4">Monthly Attendance</Typography>
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>Year</InputLabel>
          <Select value={year} onChange={(e) => setYear(Number(e.target.value))} label="Year">
            {[year - 1, year, year + 1].map((y) => (
              <MenuItem key={y} value={y}>{y}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>Month</InputLabel>
          <Select value={month} onChange={(e) => setMonth(Number(e.target.value))} label="Month">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <MenuItem key={m} value={m}>{m}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ mb: 4 }}>
        <AttendanceSummary summary={summary} />
      </Box>
      <AttendanceCalendar records={records?.data || records || []} year={year} month={month - 1} />
    </Box>
  );
};

export default MonthlyAttendance;