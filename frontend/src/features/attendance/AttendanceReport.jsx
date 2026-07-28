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
  Button,
} from '@mui/material';
import { PictureAsPdf } from '@mui/icons-material';
import AttendanceTable from './AttendanceTable';
import AttendanceCalendar from './AttendanceCalendar';
import { getAttendanceReport, getAttendance } from '../../services/attendanceService';

const AttendanceReport = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [view, setView] = useState('table'); // 'table' or 'calendar'

  const { data, isLoading } = useQuery({
    queryKey: ['attendance-report', year, month],
    queryFn: () => getAttendanceReport({ year, month }),
  });

  const { data: calendarRecords } = useQuery({
    queryKey: ['attendance', 'calendar', year, month],
    queryFn: () => getAttendance({ year, month }),
  });

  const handleExportPDF = async () => {
    try {
      const blob = await getAttendanceReport({ year, month, format: 'pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance-report-${year}-${month}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export PDF', err);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="h4">Attendance Report</Typography>
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
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>View</InputLabel>
          <Select value={view} onChange={(e) => setView(e.target.value)} label="View">
            <MenuItem value="table">Table View</MenuItem>
            <MenuItem value="calendar">Calendar View</MenuItem>
          </Select>
        </FormControl>
        <Button variant="outlined" startIcon={<PictureAsPdf />} onClick={handleExportPDF}>
          Export PDF
        </Button>
      </Box>
      {view === 'table' ? (
        <AttendanceTable records={data?.data || data || []} />
      ) : (
        <AttendanceCalendar records={calendarRecords?.data || calendarRecords || []} year={year} month={month - 1} />
      )}
    </Box>
  );
};

export default AttendanceReport;