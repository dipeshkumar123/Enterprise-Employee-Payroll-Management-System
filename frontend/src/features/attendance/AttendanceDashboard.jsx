import { Alert, Box, Button, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AttendanceCard from './AttendanceCard';
import AttendanceSummary from './AttendanceSummary';
import AttendanceCalendar from './AttendanceCalendar';
import { getAttendance, getMonthlySummary, markMyAttendance } from '../../services/attendanceService';
import { useRole } from '../../hooks/useRole';

const AttendanceDashboard = () => {
  const { isEmployee } = useRole();
  const queryClient = useQueryClient();
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const { data: records } = useQuery({
    queryKey: ['attendance', 'dashboard'],
    queryFn: () => getAttendance({ limit: 50 }),
  });

  const { data: summary } = useQuery({
    queryKey: ['attendance-summary', year, month],
    queryFn: () => getMonthlySummary(year, month),
  });
  const markMyAttendanceMutation = useMutation({
    mutationFn: markMyAttendance,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['attendance'] }),
  });

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Attendance Dashboard
      </Typography>
      {isEmployee && (
        <Box sx={{ mb: 3 }}>
          <Typography color="text.secondary" sx={{ mb: 1 }}>
            Your attendance is linked to your account and can only be recorded once per day.
          </Typography>
          <Button variant="contained" onClick={() => markMyAttendanceMutation.mutate()} disabled={markMyAttendanceMutation.isPending}>
            {markMyAttendanceMutation.isPending ? 'Marking attendance…' : 'Mark today as present'}
          </Button>
          {markMyAttendanceMutation.isSuccess && <Alert severity="success" sx={{ mt: 2 }}>Your attendance has been marked for today.</Alert>}
          {markMyAttendanceMutation.isError && <Alert severity="error" sx={{ mt: 2 }}>Unable to mark attendance. It may already be recorded for today.</Alert>}
        </Box>
      )}
      <Box sx={{ mb: 4 }}>
        <AttendanceCard stats={summary} />
      </Box>
      <Box sx={{ mb: 4 }}>
        <AttendanceSummary summary={summary} />
      </Box>
      <AttendanceCalendar records={records?.data || records || []} year={year} month={month - 1} />
    </Box>
  );
};

export default AttendanceDashboard;
