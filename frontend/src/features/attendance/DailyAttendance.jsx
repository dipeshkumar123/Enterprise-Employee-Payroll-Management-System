import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Alert,
  Typography,
} from '@mui/material';
import { MarkunreadMailbox } from '@mui/icons-material';
import AttendanceTable from './AttendanceTable';
import { getAttendance, markAttendance } from '../../services/attendanceService';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/notificationSlice';

const DailyAttendance = () => {
  const queryClient = useQueryClient();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [selectedId, setSelectedId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { data, isLoading } = useQuery({
    queryKey: ['attendance', 'daily', date],
    queryFn: () => getAttendance({ date }),
  });

  const mutation = useMutation({
    mutationFn: markAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      setSnackbar({ open: true, message: 'Attendance marked successfully', severity: 'success' });
      setOpen(false);
      dispatch(addNotification({
        id: Date.now(),
        type: 'info',
        title: 'Attendance Updated',
        message: `Attendance for ${date} has been updated.`,
        read: false,
      }));
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to mark attendance', severity: 'error' });
    },
  });

  const handleMark = () => {
    mutation.mutate({ date, status: 'Present' });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <Typography variant="h4">Daily Attendance</Typography>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Date</InputLabel>
          <Select value={date} onChange={(e) => setDate(e.target.value)} label="Date" type="date">
            <MenuItem value={date}>{date}</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" startIcon={<MarkunreadMailbox />} onClick={() => setOpen(true)}>
          Mark All Present
        </Button>
      </Box>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <AttendanceTable records={data?.data || data || []} onEdit={(id) => setSelectedId(id)} />
      )}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Mark Attendance</DialogTitle>
        <DialogContent>
          <Typography>Mark all employees as Present for {date}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleMark} variant="contained" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default DailyAttendance;
